<?php

declare(strict_types=1);

use GuzzleHttp\Psr7\{
    HttpFactory, ServerRequest
};
use Mimey\MimeTypes;
use NGSOFT\Userscript\{
    Metadata, ResponseEmitter
};
use Psr\Http\Message\ResponseInterface;
use function json_encode;

if (php_sapi_name() == 'cli') {
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

function render(ResponseInterface $response) {
    global $factory, $mimes;
    $emitter = new ResponseEmitter();
    if ($emitter->isResponseEmpty($response) && $response->getStatusCode() > 400) {
        $contents = json_encode(['error' => $response->getReasonPhrase(), 'code' => $response->getStatusCode()]);
        $response = $response
                ->withHeader('Content-Type', $mimes->getMimeType('json') . '; charset=utf-8')
                ->withBody($factory->createStream($contents));
    }
    $body = $response->getBody();
    $body->rewind();
    $content = $body->getContents();
    $response = $response->withHeader('Content-Length', strlen($content));
    $emitter->emit($response);
    exit;
}

/**
 * Dev Server Proxy Script
 */
$root = dirname(__DIR__);

$sources = [
    "src",
];

$mimes = new MimeTypes();
$factory = new HttpFactory();
$request = ServerRequest::fromGlobals();
$method = $request->getMethod();
$uri = $request->getUri();

$origin = sprintf('%s://%s:%s', $uri->getScheme(), $uri->getHost(), $uri->getPort());

$entrypoint = 'kodi.user.js';

$pathinfo = $request->getUri()->getPath();

// could use https://github.com/nikic/FastRoute but its way faster like that
if (isset($pathinfo) && $method == 'GET') {

    if ($pathinfo == '/index.php' || $pathinfo == '/') {
        header(sprintf('Location: %s/proxy/%s', $origin, $entrypoint));
        return;
    }

    $response = $factory->createResponse()
            //enable cors
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
            ->withHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->withHeader('Pragma', 'no-cache')
            ->withHeader('Expires', 'Wed, 12 Jan 1980 05:00:00 GMT');

    if (preg_match('#^/proxy/(\w+.(user|meta).js)#', $pathinfo, $matches)) {
        $script = $matches[1];
        $type = $matches[2];

        $metadata = preg_replace('#\.(user|meta)\.js$#', '.meta.json', $script);

        if (!is_file("$root/$metadata")) {
            render($factory->createResponse(404));
        }
        foreach ($sources as $dir) {
            if (is_file("$root/$dir/$script")) {
                $require = sprintf('%s/%s/%s', $origin, $dir, $script);
                break;
            }
        }

        $meta = Metadata::loadMetadata("$root/$metadata");
        $meta->setVersion(sprintf('%s.%s.dev', (string) intval(gmdate('y')), gmdate('m')));
        $meta->removeCustom('basepath');
        $scripts = $meta->getRequire();
        foreach ($scripts as &$res) {
            if (str_starts_with($res, '/')) $res = $origin . $res . '?' . time();
        }
        $meta->setRequire($scripts);

        if (isset($require)) {
            $meta->addRequire($require . '?' . time());
        }

        $response = $response
                ->withHeader('Content-Type', $mimes->getMimeType('js') . '; charset=utf-8')
                ->withBody($factory->createStream((string) $meta));
        render($response);
    } elseif (is_file($root . $pathinfo) && realpath($root . $pathinfo) != realpath(__FILE__)) {

        if (preg_match('#.php$#', $pathinfo)) {
            require_once $root . $pathinfo;
            exit;
        }

        $response = $response
                ->withHeader('Content-Type', $mimes->getMimeType(pathinfo($pathinfo, PATHINFO_EXTENSION)) . '; charset=utf-8')
                ->withBody($factory->createStreamFromFile($root . $pathinfo));
        render($response);
    }
}

render($factory->createResponse(404));

