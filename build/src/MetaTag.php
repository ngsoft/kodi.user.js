<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

class MetaTag implements \JsonSerializable, \IteratorAggregate, \Stringable {

    /** @var string */
    private $name;

    /** @var string[] */
    private $values = [];

    /** @var ?string */
    private $lastBuild;

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

    /**
     * Get Values
     * @return string[]
     */
    public function getValues(): array {
        return $this->values;
    }

    /**
     * Get last value
     *
     * @return string
     */
    public function getValue(): string {
        $index = array_key_last($this->values);
        return is_int($index) ? $this->values[$index] : '';
    }

    /**
     * Replaces values
     *
     * @param array $values
     * @return static
     */
    public function setValues(array $values) {
        $this->lastBuild = null;
        $this->values = $values;
        return $this;
    }

    /**
     * Add a single value
     * @param string $value
     * @param ?string $key
     * @return static
     */
    public function addValue(string $value, string $key = null) {
        $this->lastBuild = null;
        if (is_string($key)) $this->values[$key] = $value;
        else $this->values[] = $value;
        return $this;
    }

    /** {@inheritdoc} */
    public function getIterator() {
        foreach ($this->values as $index => $val) {
            yield [$this->name, $val, $index];
        }
    }

    /** {@inheritdoc} */
    public function jsonSerialize() {
        return [$this->name => $this->values];
    }

    /**
     * Build metadata doc comment
     *
     * @return string
     */
    private function build(): string {
        if (is_string($this->lastBuild)) return $this->lastBuild;
        $result = '';
        foreach ($this->getIterator() as list($name, $value, $index)) {

            $line = '// @' . $name;
            if (!empty($value)) {
                if (is_string($index)) {
                    $line .= " $index";
                }
                $line .= " $value";
            }
            $result .= "$line\n";
        }

        return $this->lastBuild = $result;
    }

    /** {@inheritdoc} */
    public function __toString() {
        return $this->build();
    }

    public function __debugInfo() {
        return $this->jsonSerialize();
    }

}
