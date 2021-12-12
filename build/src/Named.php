<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

class Named {

    /** @var string */
    protected $name;

    public function __construct(string $name) {
        $this->name = $name;
    }

    /**
     * Name
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

}
