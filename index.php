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
$rev = 0;

$sources = [
    "src/",
];

$metadata = 'kodi.json';
$entrypoint = 'kodi.user.js';

$origin = sprintf('%s://%s:%s', $_SERVER['REQUEST_SCHEME'], $_SERVER['SERVER_NAME'], $_SERVER['SERVER_PORT']);

define('RELEASE_MAJOR', (string) intval(gmdate('y')));
define('RELEASE_MINOR', gmdate('m'));
define('RELEASE_REVISION', (string) $rev);

define('RELEASE', sprintf('%s.%s.%s', RELEASE_MAJOR, RELEASE_MINOR, RELEASE_REVISION));

var_dump(RELEASE, $origin);

echo "<pre>\n";
var_dump($_SERVER);
