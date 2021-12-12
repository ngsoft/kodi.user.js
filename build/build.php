<?php

declare(strict_types=1);

use NGSOFT\Userscript\{
    Icon, Metadata
};

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

$root = __DIR__;
while (!is_file("$root/package.json")) {
    if ($root == $prev) {
        throw new RuntimeException('Cannot find project root dir(package.json).');
    }
    $prev = $root;
    $root = dirname($root);
}

echo "$root\n";

exit;

$sources = [
    'src',
    'src/resolvers'
];

$destination = "$root/dist";

foreach (scandir($root) as $file) {
    if (!str_ends_with($file, '.meta.json')) continue;

    $script = preg_replace('#.meta.json$#', '.user.js', $file);
    $meta = Metadata::loadMetadata("$root/$file");

    $today = sprintf('%s.%s.', (string) intval(gmdate('y')), gmdate('m'));
    $version = '';
    $rev = 0;

    if (is_file("$root/$script")) {
        $tmp = Metadata::loadUserscript("$root/$script");
        $version = $tmp->getVersion() ?? '';
    }

    if (str_starts_with($version, $today)) {
        $split = explode(".", $version);
        $rev = intval($split[2]) + 1;
    }
    $version = $today . $rev;

    //$meta->setVersion($today . $rev);

    if ($basepath = $meta->getCustom('basepath')) {
        $basepath .= $version;
        $meta->removeCustom('basepath');

        $require = $meta->getRequire();
        foreach ($require as &$res) {
            if ($res[0] == '/') $res = $basepath . $res;
        }
        $meta->setRequire($require);
    }


    //$meta->saveJSON();

    list($script, $metafile) = [preg_replace('#\.meta\.json#', '.user.js', $file), preg_replace('#\.meta\.json#', '.meta.js', $file)];
    $destScript = "$destination/$script";
    $found = false;
    foreach ($sources as $dir) {
        $path = "$root/$dir/$script";
        if (is_file($path)) {
            $found = true;
            printf("Loading %s\n", $path);
            $contents = file_get_contents($path);

            $contents = (string) $meta . $contents;
            printf("Saving %s, %s", $script, $metafile);
            //file_put_contents($destScript, $contents);
            //$meta->saveMetaFile();
        }
    }
    if (!$found) throw new RuntimeException('Cannot find script ' . $script);
}




