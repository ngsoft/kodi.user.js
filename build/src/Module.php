<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use NGSOFT\RegExp,
    RuntimeException;

class Module extends Named implements \IteratorAggregate, \Stringable {

    /** @var array<string,Module> */
    private static $_loadedModules = [];

    /** @var string */
    private $fileName;

    /** @var string */
    private $dirName;

    /** @var string[] */
    private $deps = [];

    /** @var string */
    private $contents;

    public function __construct(string $fileName) {

        if (!is_file($fileName)) {
            throw new RuntimeException(sprintf('Invalid file %s', $fileName));
        }
        $this->fileName = $fileName;
        $this->dirName = dirname($fileName);
        $name = preg_replace('/\.js$/i', '', basename($fileName));
        $this->contents = file_get_contents($fileName);
        parent::__construct($name);
        self::$_loadedModules[$name] = $this;
        $this->parseDeps();
    }

    ////////////////////////////   Static Api   ////////////////////////////

    /**
     * Add a module to the stack
     *
     * @param string $filename
     * @return static
     * @throws RuntimeException
     */
    public static function addModule(string $filename) {
        if (!is_file($fileName)) {
            throw new RuntimeException(sprintf('Invalid file %s', $fileName));
        }
        $name = preg_replace('/\.js$/i', '', basename($fileName));
        if (isset(self::$_loadedModules[$name])) return self::$_loadedModules[$name];
        return new static($filename);
    }

    ////////////////////////////   api   ////////////////////////////

    /**
     * Loads a new module
     *
     * @param string $name
     * @return static
     */
    public function loadModule(string $name) {
        $filename = sprintf('%s/%s.js', $this->dirName, $name);
        return static::addModule($filename);
    }

    ////////////////////////////   Parsers   ////////////////////////////

    /**
     * @staticvar RegExp $re
     */
    private function parseDeps() {
        /** @var RegExp $re */
        static $re;
        $re = $re ?? new RegExp('deps\h*=\h*(\[.*\])');
        $this->lastBuild = null;
        $deps = &$this->deps;
        $contents = &$this->contents;

        if ($matches = $re->exec($contents)) {
            $json = str_replace("'", '"', $json);
            $arr = \json_decode($json, true);
            if (\JSON_ERROR_NONE !== \json_last_error()) {
                throw new RuntimeException('json_decode error: ' . \json_last_error_msg());
            }
            if (!empty($arr)) {
                foreach ($arr as $dep) {
                    $deps[$dep] = $dep;
                    $this->loadModule($dep);
                }
            }
        }
    }

    ////////////////////////////   Interfaces   ////////////////////////////

    /**
     * @return \Generator<string,Module>
     */
    public function getIterator() {
        foreach ($this->deps as $name) {
            yield from $this->loadModule($name);
        }

        yield $this->name => $this;
    }

    /** {@inheritdoc} */
    public function __toString() {
        return $this->contents;
    }

    ////////////////////////////   Magic methods   ////////////////////////////


    public function __debugInfo() {

        return [
            'name' => $this->name,
            'filename' => $this->fileName,
            'deps' => $this->deps,
        ];
    }

}
