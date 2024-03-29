<?php

declare(strict_types=1);

use NGSOFT\{
    Tools, Userscript\FileName, Userscript\MetaBlock, Userscript\ModuleHelper
};

if (php_sapi_name() != 'cli')
{
    die('Cannot be run in browser.' . PHP_EOL);
}


require_once __DIR__ . '/config.php';

$root = $projectRoot;

$sources = $config->sources;
$destination = "$root/" . $config->destination;
$basePath = $config->basepath;
$modulePath = $config->modulepath;

$modulePath = "$root/$modulePath";

$today = sprintf('%s.%s.', (string) intval(gmdate('y')), gmdate('m'));

if ( ! is_dir($destination))
{
    throw new RuntimeException('Destination folder ' . $destination . ' does not exists.');
}

$found = false;
foreach ($sources as $dir)
{

    $path = "$root/$dir";
    if ( ! is_dir($path))
    {
        throw new RuntimeException('Directory ' . $path . ' does not exists.');
    }
    /** @var SplFileInfo $fileObj */
    foreach (Tools::getRecursiveDirectoryIterator($path, '.json') as $fileObj)
    {

        if ( ! $fileObj->isFile()) continue;
        if ( ! str_ends_with($fileObj->getFilename(), '.meta.json')) continue;
        $fileName = new FileName($fileObj->getFilename());
        $pathName = $fileObj->getPathname();
        $dirName = dirname($fileObj->getPathname());

        if ( ! is_file("$dirName/" . $fileName->getUserScript()))
        {
            printf("Found %s but no userscript %s, ignoring ...\n", $pathName, $fileName->getUserScript());
            continue;
        }
        $version = '';
        $rev = 0;
        $destScript = "$destination/" . $fileName->getUserScript();
        if (is_file($destScript))
        {
            $tmp = MetaBlock::loadFromFile($destScript);
            $version = $tmp->getProperty('version') ?? '';
        }

        if (str_starts_with($version, $today))
        {
            $split = explode(".", $version);
            $rev = intval($split[2]) + 1;
        }
        $version = $today . $rev;

        // load metadata
        printf("Loading metadata for %s\n", $fileName->getName());
        $meta = MetaBlock::loadFromFile($pathName);
        $require = $meta->getProperty('require') ?? [];
        $modules = $meta->getProperty('module') ?? [];
        $resources = $meta->getProperty('resource') ?? [];

        if (is_array($resources))
        {
            $rmod = false;
            foreach ($resources as $rname => $rvalue)
            {
                if (str_starts_with($rvalue, '/'))
                {
                    $resources[$rname] = $basePath . $rvalue;
                    $rmod = true;
                }
            }

            if ($rmod)
            {

                $meta->setProperty('resource', $resources);
            }
        }


        if (is_string($modules)) $modules = [$modules];
        if (is_bool($modules)) $modules = [];
        $meta->removeProperty('module');
        $meta->setProperty('version', $version);
        $comment = $meta->getDocComment();
        $contents = $comment;
        printf("Compiling new version %s\n", $version);

        $helper = new ModuleHelper();

        foreach ($modules as $moduleName)
        {
            $moduleFile = "$modulePath/$moduleName.js";
            $helper->addModule($moduleFile);
        }
        $contents .= $helper->getCode(true);
        $contents .= file_get_contents("$dirName/" . $fileName->getUserScript());
        printf("Saving '%s'\n", $destScript);
        if (file_put_contents($destScript, $contents) !== false)
        {

            printf("Saving '%s/%s'\n", $destination, $fileName->getModuleScript());
            file_put_contents($destination . DIRECTORY_SEPARATOR . $fileName->getModuleScript(), $helper->getCode(true));
            printf("Saving '%s/%s'\n", $destination, $fileName->getMetaScript());
            file_put_contents($destination . DIRECTORY_SEPARATOR . $fileName->getMetaScript(), $comment);
            $minFile = $fileName->getName() . '.min.user.js';
            $minMeta = $fileName->getName() . '.min.meta.js';
            printf("Saving '%s/%s'\n", $destination, $minFile);
            file_put_contents($destination . DIRECTORY_SEPARATOR . $minFile, $comment . ModuleHelper::minifyCode($contents));
            printf("Saving '%s/%s'\n", $destination, $minMeta);
            file_put_contents($destination . DIRECTORY_SEPARATOR . $minMeta, $comment);
            $found = true;
        }
    }
}

if ( ! $found) throw new RuntimeException('Cannot find any script.');











