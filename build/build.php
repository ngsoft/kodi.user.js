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

    $script = preg_replace('#.meta.json$#', '.user.js', $file);
    $meta = Metadata::loadMetadata("$root/$file");

    if (!$meta->getDefaulticon()) {
        $i = new NGSOFT\Userscript\Icon($meta->getIcon(), true);
        $meta->setDefaulticon($i->getBase64URL());
    }

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
    $meta->setVersion($today . $rev);

    if ($basepath = $meta->getCustom('basepath')) {
        $basepath .= $meta->getVersion();
        $meta->removeCustom('basepath');

        $require = $meta->getRequire();
        foreach ($require as &$res) {
            if ($res[0] == '/') $res = $basepath . $res;
        }
        $meta->setRequire($require);
    }


    //file_put_contents("$root/$file", json_encode($meta, JSON_PRETTY_PRINT));

    list($script, $metafile) = [preg_replace('#\.meta\.json#', '.user.js', $file), preg_replace('#\.meta\.json#', '.meta.js', $file)];
    $dest = "$root/$script";
    $found = false;
    foreach ($sources as $dir) {
        $path = "$root/$dir/$script";
        if (is_file($path)) {
            $found = true;
            printf("Loading %s\n", $path);
            $contents = file_get_contents($path);

            $contents = (string) $meta . $contents;
            printf("Saving %s, %s", $script, $metafile);
            file_put_contents($dest, $contents);
            $meta->saveMetaFile();
        }
    }
    if (!$found) throw new RuntimeException('Cannot find script ' . $script);
}




