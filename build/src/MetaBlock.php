<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use ArrayAccess,
    Countable,
    IteratorAggregate,
    JsonSerializable;
use NGSOFT\{
    RegExp, Traits\ArrayAccessCountable
};
use Stringable;
use function json_encode;

/**
 * @link https://www.tampermonkey.net/documentation.php?ext=dhdg
 */
class MetaBlock implements ArrayAccess, Countable, JsonSerializable, Stringable, IteratorAggregate {

    use ArrayAccessCountable;

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

    private function __construct() {

    }

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

    private function build(): string {
        $result = '';
        return $result;
    }

    public function __toString() {

        return $this->build();
    }

    public function __debugInfo() {
        return $this->jsonSerialize();
    }

}
