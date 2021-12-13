<?php

declare(strict_types=1);

use GuzzleHttp\Psr7\{
    HttpFactory, ServerRequest
};
use Mimey\MimeTypes,
    NGSOFT\Userscript\ResponseEmitter,
    Psr\Http\Message\ResponseInterface;
use function json_decode,
             json_encode;

if (php_sapi_name() == 'cli') {
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

function setContentType(ResponseInterface $response, string $type): ResponseInterface {
    return $response->withHeader('Content-Type', $type . '; charset=utf-8');
}

function render(ResponseInterface $response) {
    global $factory, $mimes;
    $emitter = new ResponseEmitter();
    if ($emitter->isResponseEmpty($response) && $response->getStatusCode() > 400) {
        $contents = json_encode(['error' => $response->getReasonPhrase(), 'code' => $response->getStatusCode()]);
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

$prev = null;
$root = __DIR__;

while (!is_file("$root/builder.json")) {
    if ($root == $prev) {
        throw new RuntimeException('Cannot find project root dir(builder.json).');
    }
    $prev = $root;
    $root = dirname($root);
}

$config = json_decode(file_get_contents("$root/builder.json"));

$mimes = new MimeTypes();
$factory = new HttpFactory();
$request = ServerRequest::fromGlobals();
$method = $request->getMethod();
$uri = $request->getUri();
$origin = sprintf('%s://%s:%s', $uri->getScheme(), $uri->getHost(), $uri->getPort());
$pathinfo = $request->getUri()->getPath();

if (isset($pathinfo) && $method == 'GET') {

}

render($factory->createResponse(404));

echo "<pre>\n";

var_dump($config);
