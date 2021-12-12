<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use ArrayAccess,
    Countable,
    IteratorAggregate,
    JsonSerializable;
use NGSOFT\{
    RegExp, Traits\ArrayAccessCountable, Traits\UnionType
};
use RuntimeException,
    Stringable;
use function json_decode,
             json_encode,
             str_ends_with;

/**
 * @link https://www.tampermonkey.net/documentation.php?ext=dhdg
 */
class MetaBlock implements ArrayAccess, Countable, JsonSerializable, Stringable, IteratorAggregate {

    use ArrayAccessCountable,
        UnionType;

    private const BUILTIN_TAGS = [
        'version', 'name', 'description', 'author',
        'namespace', 'homepage', 'homepageURL', 'website', 'source',
        'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
        'nocompat', 'run-at', 'noframes', 'grant',
        'resource', 'require',
        'supportURL', 'updateURL', 'downloadURL', 'antifeature',
        'include', 'match', 'exclude', 'connect',
    ];
    private const UNIQUE_TAGS = [
        'version', 'name', 'description', 'author',
        'namespace', 'homepage', 'homepageURL', 'website', 'source',
        'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
        'run-at', 'noframes',
        'supportURL', 'updateURL', 'downloadURL',
    ];
    private const SORT_TAGS = [
        [
            'version', 'name', 'description', 'author',
            'namespace', 'homepage', 'homepageURL', 'website', 'source',
        ],
        [
            'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL',
        ],
        [
            'nocompat', 'run-at', 'noframes', 'grant',
        ],
        [
            'resource', 'require',
        ],
        [
            'supportURL', 'updateURL', 'downloadURL', 'antifeature',
        ],
        [
            'custom',
        ],
        [
            'include', 'match', 'exclude', 'connect',
        ]
    ];
    public const EXT_JSON = '.meta.json';
    public const EXT_USERSCRIPT = '.user.js';
    public const EXT_META = '.meta.js';

    /** @var FileName */
    private $fileName;

    /** @var ?string */
    private $lastBuild;

    /** @var int */
    private $indent = 1;

    /**
     * tag name max length (for builder)
     * @var int
     */
    private $maxLength = 0;

    /** @var string[] */
    private $properties = [];

    /**
     * @return FileName
     */
    public function getFileName(): FileName {
        return $this->fileName;
    }

    /**
     * @return int
     */
    public function getIndent(): int {
        return $this->indent;
    }

    /**
     * Set Filename
     * @param FileName|string $fileName
     * @return static
     */
    public function setFileName($fileName) {
        $this->checkType($fileName, FileName::class, 'string');
        $this->fileName = $fileName;
        return $this;
    }

    /**
     * Set indentation between tag name and value
     * @param int $indent
     * @return static
     */
    public function setIndent(int $indent) {
        $this->indent = max($indent, 1);
        return $this;
    }

    private static function RE_BLOCK(): RegExp {
        static $re;
        $re = $re ?? RegExp::create('(?:[\/]{2,}\s*==UserScript==\n*)([\s\S]*)(?:[\/]{2,}\s*==\/UserScript==\n*)');
        return $re;
    }

    private static function RE_PROP(): RegExp {
        static $re;
        $re = $re ?? RegExp::create('[\/]{2,}[ \t]*@([\w\-]+)[ \t]*(.*)\n*', 'g');
        return $re;
    }

    private static function RE_KEY_VALUE(): RegExp {
        static $re;
        $re = $re ?? RegExp::create('^(\S+)[ \t]+(\S+)$');
        return $re;
    }

    private static function RE_BUILTIN(): RegExp {
        static $re;
        $re = $re ?? RegExp::create(sprintf('^(?:(%s)(?:\:[\w\-]+)?)$', implode('|', self::BUILTIN_TAGS)));
        return $re;
    }

    ////////////////////////////   Implemetation   ////////////////////////////

    /**
     * Creates a new instance
     *
     * @param string $name userscript name
     * @return static
     */
    static public function create(string $name): self {
        $instance = new static();
        $instance->setFileName($name);
        return $instance;
    }

    /**
     * Loads Metadata from file
     * @param string $filename
     * @return static
     */
    public static function loadFromFile(string $filename): self {

        if (!is_file($filename)) {
            throw new RuntimeException($filename . ' does not exists.');
        }

        $file = pathinfo($filename, PATHINFO_FILENAME);
        $dirName = dirname($filename);
        $extensions = implode('|', [self::EXT_JSON, self::EXT_META, self::EXT_USERSCRIPT]);
        if (!preg_match(sprintf('#(%s)$#', $extensions), $file)) {
            throw new RuntimeException('Cannot import ' . $file . ' invalid extension(' . $extensions . ').');
        }

        $instance = new static();
        $instance->setFileName($file);
        $contents = file_get_contents($filename);
        if (str_ends_with($file, self::EXT_JSON)) {
            //import json
            $instance->parseJson($contents);
            return $instance;
        }

        //import headers

        $instance->parseHeaders($contents);

        return $instance;
    }

    ////////////////////////////   Getters/Setters   ////////////////////////////


    public function setProperty(string $name, $value) {
        $this->checkType($value, 'string', 'array', 'bool');
        $isBuiltIn = false;
        $prop = $name;
        $isUnique = false;
        if ($matches = self::RE_BUILTIN()->exec($name)) {
            $isBuiltIn = true;
            $prop = $matches[1];
            $isUnique = in_array($prop, self::UNIQUE_TAGS);
        }
        $this->storage[$name] = $this->storage[$name] ?? new MetaTag($name);
        $item = &$this->storage[$name];

        if (is_bool($value)) {
            if ($value === true) $value = '';
            else return $this->unset($name);
        }

        if (is_string($value)) {

        }





        return $this;
    }

    public function removeProperty(string $name) {

        unset($this->storage[$name]);
        unset($this->properties[$name]);
        return $this;
    }

    ////////////////////////////   Parser   ////////////////////////////



    private function parseJson(string $json) {

        if ($data = json_decode($json, true)) {

            foreach ($data as $tag => $value) {

            }
        }
    }

    private function parseHeaders(string $jsCode) {

    }

    ////////////////////////////   Builder   ////////////////////////////


    private function build(): string {
        $result = '';
        return $result;
    }

    ////////////////////////////   Interfaces   ////////////////////////////


    public function getIterator() {
        foreach ($this->storage as $item) {
            if ($item instanceof MetaTag) {
                yield from $item->getIterator();
            }
        }
    }

    public function toJson(int $options = null) {
        if (is_null($options)) $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES;
        return json_encode($this, $options);
    }

    public function jsonSerialize() {
        return $this->storage;
    }

    public function __toString() {
        return $this->build();
    }

    public function __debugInfo() {
        return $this->jsonSerialize();
    }

    private function __construct() {

    }

}
