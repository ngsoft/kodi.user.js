<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use JsonSerializable,
    RuntimeException,
    Stringable;

class FileName extends Named implements JsonSerializable, Stringable
{

    public function __construct(string $name)
    {
        $name = preg_replace('#.(meta|user).js\w*?$#', '', $name);
        if ( ! preg_match('/[\w\-]+/', $name))
        {
            throw new RuntimeException('Invalid name: ' . $name);
        }
        parent::__construct($name);
    }

    public function getModuleScript(): string
    {
        return sprintf('%s.modules.js', $this->name);
    }

    public function getUserScript(): string
    {
        return sprintf('%s.user.js', $this->name);
    }

    public function getMetaScript(): string
    {
        return sprintf('%s.meta.js', $this->name);
    }

    public function getMetaJson(): string
    {
        return sprintf('%s.meta.json', $this->name);
    }

    public function toArray(): array
    {

        return [
            'name' => $this->getName(),
            'userscript' => $this->getUserScript(),
            'metadata' => [
                'userscript' => $this->getMetaScript(),
                'json' => $this->getMetaJson()
            ],
        ];
    }

    public function jsonSerialize()
    {
        return $this->toArray();
    }

    public function __toString()
    {
        return $this->getUserScript();
    }

    public function __debugInfo()
    {
        return $this->toArray();
    }

}
