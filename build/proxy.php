<?php

declare(strict_types=1);

use GuzzleHttp\Psr7\{
    HttpFactory, ServerRequest
};
use Mimey\MimeTypes;
use NGSOFT\{
    Tools, Userscript\FileName, Userscript\JSON, Userscript\MetaBlock, Userscript\ModuleHelper, Userscript\ResponseEmitter, Userscript\View
};
use Psr\Http\Message\ResponseInterface;

if (php_sapi_name() == 'cli')
{
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/config.php';

function setContentType(ResponseInterface $response, string $type): ResponseInterface
{
    return $response->withHeader('Content-Type', $type . '; charset=utf-8');
}

function render(ResponseInterface $response)
{
    global $factory, $mimes;
    $emitter = new ResponseEmitter();
    if ($emitter->isResponseEmpty($response) && $response->getStatusCode() > 400)
    {
        $contents = JSON::encode(['error' => $response->getReasonPhrase(), 'code' => $response->getStatusCode()]);
        $response = setContentType($response, $mimes->getMimeType('json'))
                ->withBody($factory->createStream($contents));
    }
    $body = $response->getBody();
    $body->rewind();
    $content = $body->getContents();
    $response = $response->withHeader('Content-Length', strlen($content));
    $emitter->emit($response);
    exit;
}

$root = $projectRoot;
$sources = $config->sources;
$modulePath = $config->modulepath;

$mimes = new MimeTypes();
$factory = new HttpFactory();
$request = ServerRequest::fromGlobals();
$method = $request->getMethod();
$uri = $request->getUri();
$origin = sprintf('%s://%s:%s', $uri->getScheme(), $uri->getHost(), $uri->getPort());
$pathinfo = $request->getUri()->getPath();

View::set('root', $root);
View::set('config', $config);
View::set('package', $package);
View::set('request', $request);
$route = null;

if (isset($pathinfo) && $method == 'GET')
{

    $response = $factory->createResponse();
    foreach ($config->proxy->headers as $name => $value) $response = $response->withHeader($name, $value);

    if ($pathinfo == '/index.php' || $pathinfo == '/' || $pathinfo == '/home')
    {
        $route = 'home';
    }
    elseif (preg_match(sprintf('#^%s([\w]+.(?:user|meta).js(?:on)?)#', $config->proxy->path), $pathinfo, $matches))
    {
        $route = 'proxy';
        $param = $matches[1];
    }
    elseif (is_file($root . $pathinfo) && realpath($root . $pathinfo) != realpath(__FILE__))
    {
        if (preg_match('#.php$#', $pathinfo) || preg_match('#\/\.#', $pathinfo))
        {
            render($factory->createResponse(403));
        }
        $route = 'file';
        $param = "$root$pathinfo";
    }

    if ($route == 'home')
    {

        $scripts = [];

        foreach ($sources as $dir)
        {

            $path = "$root/$dir";
            if ( ! is_dir($path))
            {
                throw new RuntimeException('Directory ' . $path . ' does not exists.');
            }

            /** @var SplFileInfo $fileObj */
            foreach (Tools::getRecursiveDirectoryIterator($path, '.json') as $fileObj)
            {
                if ( ! $fileObj->isFile()) continue;
                if ( ! str_ends_with($fileObj->getFilename(), '.meta.json')) continue;
                $fileName = new FileName($fileObj->getFilename());
                $pathName = $fileObj->getPathname();
                $dirName = dirname($fileObj->getPathname());
                if ( ! is_file($dirName . DIRECTORY_SEPARATOR . $fileName->getUserScript()))
                {
                    continue;
                }

                $meta = MetaBlock::loadFromFile($pathName);
                $scripts[$fileName->getName()] = $meta;
            }
        }


        $view = new View();
        render($view->render('home.php', ['scripts' => $scripts]));
    }
    elseif ($route == 'file')
    {
        render(setContentType($response, $mimes->getMimeType(pathinfo($param, PATHINFO_EXTENSION)))
                        ->withBody($factory->createStreamFromFile($param)));
    }
    elseif ($route == 'proxy')
    {

        //find file

        $jsonMetaFile = preg_replace('#.(meta|user).js$#', '.meta.json', $param);

        foreach ($sources as $source)
        {
            $path = "$root/$source";
            /** @var SplFileInfo $fileObj */
            foreach (Tools::getRecursiveDirectoryIterator($path, 'json') as $fileObj)
            {
                if ($fileObj->getFilename() == $jsonMetaFile)
                {
                    $dirName = $fileObj->getPath();
                    $fileName = new FileName($param);
                    $jsonPath = $fileObj->getPathname();
                    $userPath = $dirName . DIRECTORY_SEPARATOR . $fileName->getUserScript();
                    if (str_ends_with($param, '.js'))
                    {

                        if ( ! is_file($userPath)) continue;
                        $relative = str_replace(realpath($root), '', realpath($userPath));
                        $relative = str_replace('\\', '/', $relative); // windows is a b*

                        $meta = MetaBlock::loadFromFile($jsonPath);
                        $require = $meta->getProperty('require') ?? [];
                        if ($modules = $meta->getProperty('module'))
                        {
                            if (is_string($modules)) $modules = [$modules];
                            if (is_bool($modules)) $modules = [];
                            $meta->removeProperty('module');

                            $helper = new ModuleHelper();

                            foreach ($modules as $module)
                            {
                                //deps
                                $modFileName = $root . DIRECTORY_SEPARATOR . $modulePath . DIRECTORY_SEPARATOR . $module . '.js';
                                $helper->addModule($modFileName);
                            }

                            foreach ($helper->toArray() as $module)
                            {
                                $require[] = sprintf('%s/%s/%s.js?%u', $origin, $modulePath, $module->getName(), time());
                            }
                        }

                        if ($res = $meta->getProperty('resource'))
                        {
                            foreach ($res as $n => $v)
                            {
                                if (str_starts_with($v, '/'))
                                {
                                    $res[$n] = sprintf('%s%s?%u', $origin, $v, time());
                                }
                            }

                            $meta->setProperty('resource', $res);
                        }

                        //loads last
                        if (isset($relative))
                        {
                            $require[] = sprintf('%s%s?%u', $origin, $relative, time());
                        }
                        $meta->setProperty('version', sprintf('%s.%s.dev', (string) intval(gmdate('y')), gmdate('m')));
                        $meta->setProperty('require', $require);
                        $meta->setProperty('debug', true);
                        $contents = $meta->getDocComment();

                        $response = $response->withBody($factory->createStream($contents));
                    }
                    else $response = $response->withBody($factory->createStreamFromFile($jsonPath));
                    $response = setContentType($response, $mimes->getMimeType(pathinfo($param, PATHINFO_EXTENSION)));
                    render($response);
                }
            }
        }
    }
}

render($factory->createResponse(404));

