<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use IteratorAggregate,
    JShrink\Minifier;

class ModuleHelper implements IteratorAggregate {

    /** @var array<string,Module> */
    private $modules = [];

    /** @var string[] */
    private $sorted = [];

    /** @var string */
    private $lastBuild = '';

    public static function minifyCode(string $code) {
        return Minifier::minify($code);
    }

    ////////////////////////////   API   ////////////////////////////

    /**
     * Add a module to the stack
     * @param string $fileName
     * @return Module
     */
    public function addModule(string $fileName) {
        $instance = new Module($fileName);
        $this->modules[$instance->getName()] = $instance;
        $this->sortModules();
        return $instance;
    }

    /**
     *
     * @return Module[]
     */
    public function toArray(): array {
        return $this->sorted;
    }

    public function getCode(bool $minify = false): string {
        $code = $this->build();
        return $minify ? static::minifyCode($code) : $code;
    }

    ////////////////////////////   Utils   ////////////////////////////


    private function sortModules() {
        $this->lastBuild = '';
        $sorted = &$this->sorted;
        $sorted = [];
        $loaded = [];
        foreach ($this->modules as $mod) {
            foreach ($mod as $name => $module) {
                if (isset($loaded[$name])) continue;
                $loaded[$name] = $name;
                $sorted[] = $module;
            }
        }
    }

    private function build(): string {
        if (!empty($this->lastBuild)) return $this->lastBuild;
        $result = '';
        foreach ($this->getIterator() as $module) {
            $result .= (string) $module;
            $result .= "\n";
        }
        return $this->lastBuild = $result;
    }

    ////////////////////////////   Interfaces   ////////////////////////////

    /**
     * @return \Generator<string,Module>
     */
    public function getIterator() {
        foreach ($this->sorted as $module) {
            yield $module->getName() => $module;
        }
    }

    public function __toString() {
        return $this->build();
    }

}
