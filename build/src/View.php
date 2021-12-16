<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use GuzzleHttp\Psr7\HttpFactory,
    NGSOFT\Tools,
    Psr\Http\Message\ResponseInterface,
    RuntimeException;

class View {

    protected static $data = [];

    public static function set(string $key, $value) {
        static::$data[$key] = $value;
    }

    public static function get(string $key) {
        return static::$data[$key] ?? null;
    }

    /** @var HttpFactory */
    protected $factory;

    public function __construct() {
        $this->factory = new HttpFactory();
    }

    public function render(string $template, array $data = []): ResponseInterface {

        $fname = dirname(__DIR__) . '/views/' . $template;
        if (!is_file($fname)) {
            throw new RuntimeException('Invalid template ' . $template);
        }
        $response = $this->factory->createResponse();

        $data = array_replace(static::$data, $data);

        ob_start();
        Tools::pushd(dirname($fname));
        Tools::include($fname, false, $data);
        $contents = ob_get_clean();
        Tools::popd();

        return $response->withBody($this->factory->createStream($contents));
    }

}
