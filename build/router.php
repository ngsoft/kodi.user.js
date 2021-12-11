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
use function GuzzleHttp\json_encode;

if (php_sapi_name() == 'cli') {
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

function render(string $contents = '', array $headers = [], int $code = 200): ResponseInterface {
    global $factory;
    $emitter = new ResponseEmitter();
    $response = $factory->createResponse($code);
    $headers['Content-Length'] = strlen($contents);
    $body = $factory->createStream($contents);
    $body->rewind();
    foreach ($headers as $k => $v) {
        $response = $response->withHeader($k, $v);
    }

    $response = $response->withBody($body);
    $emitter->emit($response);
    exit;
}

function invalid_route() {
    global $mimes;
    $contents = json_encode(["error" => "404 Not Found"]);
    $headers = [
        'Content-Type' => $mimes->getMimeType('json')
    ];
    render($contents, $headers, 404);
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

    //enable cors
    $headers = [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET,POST,OPTIONS,DELETE,PUT'
    ];

    if (preg_match('#^/proxy/(\w+.(user|meta).js)#', $pathinfo, $matches)) {
        $script = $matches[1];
        $type = $matches[2];

        $metadata = preg_replace('#\.(user|meta)\.js$#', '.meta.json', $script);

        if (!is_file("$root/$metadata")) {
            invalid_route();
        }
        foreach ($sources as $dir) {
            if (is_file("$root/$dir/$script")) {
                $require = sprintf('%s/%s/%s', $origin, $dir, $script);
                break;
            }
        }



        $meta = Metadata::loadMetadata("$root/$metadata");
        $meta->setVersion(sprintf('%s.%s.dev', (string) intval(gmdate('y')), gmdate('m')));

        if (isset($require)) {
            $meta->addRequire($require);
        }

        $headers['Content-Type'] = $mimes->getMimeType('js');
        $contents = (string) $meta;
        $len = strlen($contents);
        render($contents, $headers);
    } elseif (is_file($root . $pathinfo) && realpath($root . $pathinfo) != __FILE__) {

        if (preg_match('#.(php|html)$#', $pathinfo)) {
            require_once $root . $pathinfo;
            exit;
        }
        $headers['Content-Type'] = $mimes->getMimeType(pathinfo($pathinfo, PATHINFO_EXTENSION));
        $contents = file_get_contents($root . $pathinfo);
        render($contents, $headers);
    } else invalid_route();
}

invalid_route();

