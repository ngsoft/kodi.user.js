<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use JsonSerializable,
    Stringable;

class FileName implements JsonSerializable, Stringable {

    /** @var string */
    private $name;

    public function __construct(string $name) {
        $this->setName($name);
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name) {
        $this->name = preg_replace('#.(meta|user).js\w*?$#', '', $name);
        return $this;
    }

    public function getUserScript(): string {
        return sprintf('%s.user.js', $this->name);
    }

    public function getMetaScript(): string {
        return sprintf('%s.meta.js', $this->name);
    }

    public function getMetaJson(): string {
        return sprintf('%s.meta.json', $this->name);
    }

    public function toArray(): array {

        return [
            'name' => $this->getName(),
            'userscript' => $this->getUserScript(),
            'metadata' => [
                'userscript' => $this->getMetaScript(),
                'json' => $this->getJsonMetaFile()
            ],
        ];
    }

    public function jsonSerialize() {
        return $this->toArray();
    }

    public function __toString() {
        return $this->name;
    }

}
