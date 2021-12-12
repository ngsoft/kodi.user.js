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

    /** @var string[] */
    private $custom = [];

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
        $this->fileName = $fileName instanceof FileName ? $fileName : new FileName($fileName);
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

        $file = basename($filename);
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

    /**
     * Set a property
     *
     * @param string $name
     * @param string|array|bool $value
     * @return static
     */
    public function setProperty(string $name, $value) {
        $this->checkType($value, 'string', 'array', 'bool');
        $this->storage[$name] = $this->storage[$name] ?? new MetaTag($name);
        /** @var MetaTag $item */
        $item = &$this->storage[$name];

        if (is_bool($value)) {
            if ($value === true) $value = '';
            else return $this->removeProperty($name);
        }
        if (str_contains($name, 'icon') && self::isBuiltin($name)) {
            $item = new Icon($value, true);
        } else $item->setValue($value);
        $this->lastBuild = null;
        $len = strlen($name);
        if ($len > $this->maxLength) $this->maxLength = $len;
        $this->properties[$name] = $name;
        if (!self::isBuiltin($name)) $this->custom[$name] = $name;
        return $this;
    }

    /**
     * Appends property
     *
     * @param string $name
     * @param string|array|bool $value
     */
    public function addProperty(string $name, $value) {
        $this->checkType($value, 'string', 'array', 'bool');

        $this->storage[$name] = $this->storage[$name] ?? new MetaTag($name);
        /** @var MetaTag $item */
        $item = &$this->storage[$name];
        if (is_bool($value)) {
            if ($value === true) $value = '';
            else return $this->removeProperty($name);
        }

        if (str_contains($name, 'icon') && self::isBuiltin($name)) {
            $item = new Icon($value, true);
        } elseif (is_string($value)) {
            if (self::isUnique($name)) $item->setValue($value);
            else $item->addValue($value);
        } else {
            foreach ($value as $index => $val) {
                if (!is_string($index)) {
                    $item->addValue($val);
                } else $item->addValue($val, $index);
            }
        }

        $this->lastBuild = null;
        $len = strlen($name);
        if ($len > $this->maxLength) $this->maxLength = $len;
        $this->properties[$name] = $name;
        if (!self::isBuiltin($name)) $this->custom[$name] = $name;
        return $this;
    }

    /**
     * Removes a property
     * @param string $name
     * @return static
     */
    public function removeProperty(string $name) {
        $this->lastBuild = null;
        unset($this->storage[$name]);
        unset($this->properties[$name]);
        return $this;
    }

    /**
     * Get a property
     * @param string $name
     * @return mixed
     */
    public function getProperty(string $name) {
        $value = $this->storage[$name] ?? null;
        if ($value instanceof Icon) {
            $value = (string) $value;
        } elseif ($value instanceof MetaTag) {
            $value = $value->jsonSerialize();
        }
        return $value;
    }

    ////////////////////////////   Parser   ////////////////////////////


    public static function isBuiltin(string $name): bool {

        return self::RE_BUILTIN()->test($name);
    }

    public static function isUnique(string $name): bool {
        $prop = $name;
        if ($matches = self::RE_BUILTIN()->exec($name)) {
            $prop = $matches[1];
        }
        return in_array($prop, self::UNIQUE_TAGS);
    }

    private function parseJson(string $json) {
        if ($data = json_decode($json, true)) {
            foreach ($data as $tag => $value) {
                $this->addProperty($tag, $value);
            }
        }
    }

    private function parseHeaders(string $jsCode) {

    }

    ////////////////////////////   Builder   ////////////////////////////

    private function getFormatIterator() {

        $properties = $this->properties;
        $len = 0;
        foreach (self::SORT_TAGS as $block) {
            if ($len > 0) yield '' => '';
            $len = 0;

            foreach ($block as $tag) {
                if ($tag == 'custom') {
                    foreach ($this->custom as $prop => $value) {
                        $len++;
                        yield $prop => $value;
                    }
                    continue;
                }
                if (isset($properties[$tag])) {
                    $len++;
                    if ($key = $this->getKey($tag)) yield $tag => $this->{$key};
                }
            }
        }
    }

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

        return [
            'fileName' => $this->fileName,
            'data' => $this->storage
        ];
    }

    private function __construct() {

    }

}
