<?php

declare(strict_types=1);

function findFile(string $filename, string $root = null): ?string {

    $prev = null;
    $root = $root ?? __DIR__;

    while (!is_file($root . DIRECTORY_SEPARATOR . $filename)) {
        if ($root == $prev) {
            throw new RuntimeException('Cannot find ' . $filename . ' file.');
        }
        $prev = $root;
        $root = dirname($root);
    }

    return realpath($root);
}

$composerRoot = findFile('composer.json');
$nodeRoot = findFile('package.json');
$projectRoot = findFile('builder.json');

if (!is_file($composerRoot . '/vendor/autoload.php')) {
    throw new RuntimeException('Cannot find composer autoloader in ' . $composerRoot . ', Please run composer update.');
}

require_once $composerRoot . '/vendor/autoload.php';

$config = json_decode(file_get_contents("$projectRoot/builder.json"));
$package = json_decode(file_get_contents("$nodeRoot/package.json"));

