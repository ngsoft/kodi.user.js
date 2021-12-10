<?php

declare(strict_types=1);

if (php_sapi_name() == 'cli') {
    die('Cannot be run in cli.' . PHP_EOL);
}

require_once __DIR__ . '/build/vendor/autoload.php';

/**
 * Dev Server Proxy Script
 */
$root = __DIR__;

$entrypoint = '/src/kodi.user.js';
$sources = [
    "$root/src",
];

$origin = sprintf('%s://%s:%s', $_SERVER['REQUEST_SCHEME'], $_SERVER['SERVER_NAME'], $_SERVER['SERVER_PORT']);

var_dump($origin);

echo "<pre>\n";
var_dump($_SERVER);
