<?php

declare(strict_types=1);

if (php_sapi_name() != 'cli') {
    die('Cannot be run in browser.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

$root = dirname(__DIR__);

$sources = [
    'src'
];

foreach (scandir($root) as $file) {
    if (!str_ends_with($file, '.meta.json')) continue;

    $meta = NGSOFT\Userscript\Metadata::loadMetadata("$root/$file");

    var_dump($meta, (string) $meta);
}




