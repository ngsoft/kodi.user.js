<?php

declare(strict_types=1);

use NGSOFT\{
    Tools, Userscript\FileName, Userscript\MetaBlock
};
use function GuzzleHttp\json_decode;

if (php_sapi_name() != 'cli') {
    die('Cannot be run in browser.' . PHP_EOL);
}

require_once __DIR__ . '/vendor/autoload.php';

function saveFile($contents, string $filename) {
    $toSave = (string) $contents;

    $dir = dirname($filename);
    if (!is_dir($filename)) @mkdir($dir, 0777, true);
    return file_put_contents($filename, $toSave) !== false;
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

$sources = $config->sources;
$destination = "$root/" . $config->destination;
$basePath = $config->basepath;
$modulePath = $config->modulepath;

$modulePath = "$root/$modulePath";

$today = sprintf('%s.%s.', (string) intval(gmdate('y')), gmdate('m'));

if (!is_dir($destination)) {
    throw new RuntimeException('Destination folder ' . $destination . ' does not exists.');
}

$found = false;
foreach ($sources as $dir) {

    $path = "$root/$dir";
    if (!is_dir($path)) {
        throw new RuntimeException('Directory ' . $path . ' does not exists.');
    }
    /** @var SplFileInfo $fileObj */
    foreach (Tools::getRecursiveDirectoryIterator($path, '.json') as $fileObj) {

        if (!$fileObj->isFile()) continue;
        if (!str_ends_with($fileObj->getFilename(), '.meta.json')) continue;
        $fileName = new FileName($fileObj->getFilename());
        $pathName = $fileObj->getPathname();
        $dirName = dirname($fileObj->getPathname());

        if (!is_file("$dirName/" . $fileName->getUserScript())) {
            printf("Found %s but no userscript %s, ignoring ...\n", $pathName, $fileName->getUserScript());
            continue;
        }
        $version = '';
        $rev = 0;
        $destScript = "$destination/" . $fileName->getUserScript();
        if (is_file($destScript)) {
            $tmp = MetaBlock::loadFromFile($destScript);
            $version = $tmp->getProperty('version') ?? '';
        }

        if (str_starts_with($version, $today)) {
            $split = explode(".", $version);
            $rev = intval($split[2]) + 1;
        }
        $version = $today . $rev;

        // load metadata
        printf("Loading metadata for %s\n", $fileName->getName());
        $meta = MetaBlock::loadFromFile($pathName);
        $require = $meta->getProperty('require') ?? [];
        $modules = $meta->getProperty('module') ?? [];
        if(is_string($modules)) $modules = [$modules];
        if(is_bool($modules)) $modules = [];
        $meta->removeProperty('module');
        $meta->setProperty('version', $version);
        $comment = $meta->getDocComment();
        $contents = $comment;
        printf("Compiling new version %s\n", $version);

        foreach ($modules as $module) {
            $moduleFile = "$modulePath/$module.js";
            if (!is_file($moduleFile)) {
                throw new RuntimeException('Cannot find module in ' . $moduleFile);
            }
            $contents .= file_get_contents($moduleFile) . "\n";
        }
        $contents .= file_get_contents("$dirName/" . $fileName->getUserScript());

        printf("Saving '%s'\n", $destScript);
        if (file_put_contents($destScript, $contents) !== false) {
            printf("Saving '%s/%s'\n", $destination, $fileName->getMetaScript());
            file_put_contents("$destination/" . $fileName->getMetaScript(), $comment);
            $found = true;
        }
    }
}

if (!$found) throw new RuntimeException('Cannot find any script.');











