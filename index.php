<?php

declare(strict_types=1);

use NGSOFT\Userscript\Metadata,
    Mimey\MimeTypes;

if (php_sapi_name() == 'cli') {
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/build/vendor/autoload.php';

function invalid_route() {
    global $mimes;
    header("HTTP/1.1 404 Not Found");
    $mime = $mimes->getMimeType('json');
    $contents = json_encode([
        "error" => "404 Not Found"
    ]);
    $len = strlen($contents);
    header(sprintf('Content-Type: %s', $mime, true));
    header(sprintf('Content-Length: %u', $len, true));
    die($contents);
}

/**
 * Dev Server Proxy Script
 */
$root = __DIR__;

$origin = sprintf('%s://%s', $_SERVER['REQUEST_SCHEME'] ?? 'http', $_SERVER['HTTP_HOST']);

$sources = [
    "src",
];

$mimes = new MimeTypes();

$entrypoint = 'kodi.user.js';

if (!preg_match('#\.js#', $_SERVER['REQUEST_URI'])) {
    header(sprintf('Location: %s/proxy/%s', $origin, $entrypoint));
    return;
}

$pathinfo = $_SERVER['PATH_INFO'] ?? $_SERVER['REQUEST_URI'] ?? null;

if (isset($pathinfo)) {

    //enable cors

    header('Access-Control-Allow-Origin: *', true);
    header('Access-Control-Allow-Methods: GET,POST,OPTIONS,DELETE,PUT', true);

    if (preg_match('#^/proxy/(\w+.user.js)#', $pathinfo, $matches)) {
        $script = $matches[1];
        $metadata = preg_replace('#\.user\.js$#', '.meta.json', $script);

        if (!is_file("$root/$metadata")) {
            invalid_route();
        }
        foreach ($sources as $dir) {
            if (is_file("$root/$dir/$script")) {
                $require = sprintf('%s/%s/%s', $origin, $dir, $script);
                break;
            }
        }
    } elseif (preg_match('#^/proxy/(\w+.meta.js)#', $pathinfo, $matches)) {
        $metafile = $matches[1];
        $script = preg_replace('#\.meta\.js$#', '.user.js', $metafile);
        $metadata = preg_replace('#\.js$#', '.json', $metafile);

        if (!is_file("$root/$metadata")) {
            invalid_route();
        }

        foreach ($sources as $dir) {
            if (is_file("$root/$dir/$script")) {
                $require = sprintf('%s/%s/%s', $origin, $dir, $script);
                break;
            }
        }
    } elseif (is_file($root . $pathinfo)) {

        $mime = $mimes->getMimeType(pathinfo($pathinfo, PATHINFO_EXTENSION));
        $contents = file_get_contents($root . $pathinfo);
        $len = strlen($contents);
        header(sprintf('Content-Type: %s', $mime, true));
        header(sprintf('Content-Length: %u', $len, true));
        die($contents);
    } else invalid_route();


    $meta = Metadata::loadMetadata("$root/$metadata");
    $meta->setVersion(sprintf('%s.%s.dev', (string) intval(gmdate('y')), gmdate('m')));

    if (isset($require)) {
        $meta->addRequire($require);
    }

    $contents = (string) $meta;
    $len = strlen($contents);
    $mime = $mimes->getMimeType('js');

    header(sprintf('Content-Type: %s', $mime, true));
    header(sprintf('Content-Length: %u', $len, true));

    die($contents);
}


