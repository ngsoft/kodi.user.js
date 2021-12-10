<?php

declare(strict_types=1);

use NGSOFT\Userscript\Metadata;

if (php_sapi_name() != 'cli') {
    die('Cannot be run in browser.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

$root = dirname(__DIR__);

$sources = [
    'src'
];

$major; $minor; $release;

foreach (scandir($root) as $file) {
    if (!str_ends_with($file, '.meta.json')) continue;

    $meta = Metadata::loadMetadata("$root/$file");

    if (!$meta->getDefaulticon()) {
        $meta->setDefaulticon($meta->getIcon(), true);
    }

    $today = sprintf('%s.%s.', (string) intval(gmdate('y')), gmdate('m'));
    $version = $meta->getVersion() ?? '';
    $rev = 0;

    if (str_starts_with($version, $today)) {
        $split = explode(".", $version);
        $rev = $version[2] + 1;
    }
    $meta->setVersion($today . $rev);

    file_put_contents("$root/$file", json_encode($meta, JSON_PRETTY_PRINT));

    var_dump($meta, (string) $meta);
}




