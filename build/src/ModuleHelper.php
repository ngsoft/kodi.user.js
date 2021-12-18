<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use IteratorAggregate;

class ModuleHelper implements IteratorAggregate {

    /** @var array<string,Module> */
    private $modules = [];

    /** @var string[] */
    private $sorted = [];

    /**
     * Add a module to the stack
     * @param string $fileName
     * @return Module
     */
    public function addModule(string $fileName) {
        $instance = new Module($fileName);
        $this->modules[$instance->getName()] = $instance;
        return $instance;
    }

    private function sortModules() {
        $sorted = &$this->sorted;
        $sorted = [];
        foreach ($this->modules as $name => $module) {

        }
    }

    /**
     * @return \Generator<string,Module>
     */
    public function getIterator() {

        foreach ($this->sorted as $name) {
            yield $name => $this->modules[$name];
        }
    }

}
