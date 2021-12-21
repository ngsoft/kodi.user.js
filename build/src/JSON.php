<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use InvalidArgumentException;

class JSON {

    /**
     * Wrapper for JSON encoding that throws when an error occurs.
     *
     * @param mixed $value
     * @param int $options
     * @param int $depth
     * @return string
     * @throws InvalidArgumentException
     */
    static function encode($value, int $options = JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES, int $depth = 512): string {
        $json = \json_encode($value, $options, $depth);
        if (\JSON_ERROR_NONE !== \json_last_error()) {
            throw new InvalidArgumentException('json_encode error: ' . \json_last_error_msg());
        }
        return $json;
    }

    /**
     * Wrapper for json_decode that throws when an error occurs.
     *
     * @param string $json
     * @param bool $assoc
     * @param int $options
     * @param int $depth
     * @return object|array|string|int|float|bool|null
     * @throws InvalidArgumentException
     */
    static function decode(string $json, bool $assoc = false, int $options = 0, int $depth = 512) {
        $data = \json_decode($json, $assoc, $depth, $options);
        if (\JSON_ERROR_NONE !== \json_last_error()) {
            throw new InvalidArgumentException('json_decode error: ' . \json_last_error_msg());
        }
        return $data;
    }

    /**
     * The JSON.stringify() method converts a value to a JSON string
     *
     * @param mixed $value
     * @return string
     */
    static function stringify($value): string {
        return self::encode($value);
    }

    /**
     * Parses a JSON string
     * 
     * @param string $json
     * @return mixed
     */
    static function parse(string $json) {
        return self::decode($json, true);
    }

}
