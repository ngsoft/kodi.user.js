<?php

declare(strict_types=1);

namespace NGSOFT\Userscript;

use GuzzleHttp\{
    Client, Psr7\HttpFactory
};
use JsonSerializable,
    Mimey\MimeTypes,
    NGSOFT\RegExp,
    RuntimeException,
    Stringable,
    Throwable;

class Icon extends Named implements Stringable, JsonSerializable, \IteratorAggregate {

    /** @var string */
    private $url;

    /** @var ?string */
    private $b64URL;

    /** @var bool */
    private $changed = false;

    /** @var bool */
    private $convert;

    /** @var HttpFactory */
    private $httpFactory;

    public function __construct(string $name, $url, bool $convert = false) {

        parent::__construct($name);
        $this->httpFactory = new HttpFactory();
        if (is_string($url)) $this->url = $url;
        elseif (is_array($url)) {
            foreach ($url as $prop => $val) {
                if (property_exists($this, $prop)) $this->{$prop} = $val;
            }
        } else throw new RuntimeException('Invalid URL.');
        $this->convert = $convert;

        if ($convert && !$this->b64URL) {
            $this->getBase64URL();
        }
    }

    private function isHTTP(string $url): bool {
        static $re;
        $re = $re ?? new RegExp('^https?:[\/]{2}');
        return $re->test($url);
    }

    public function getURL(): string {
        return $this->url;
    }

    public function getChanged(): bool {
        return $this->changed;
    }

    public function getFilename(): ?string {

        static $re;
        $re = $re ?? $re = new RegExp('\.(\w+)$');

        if ($this->isHTTP($this->url)) {
            $uri = $this->httpFactory->createUri($this->url);
            $path = preg_split('/[\/]+/', $uri->getPath());
            $basename = array_pop($path);

            if ($matches = $re->exec($basename)) {
                return $matches[1];
            }
        }
        return null;
    }

    public function getBase64URL(): ?string {

        if (preg_match('/;base64,/', $this->url)) return $this->url;
        elseif (isset($this->b64URL)) return $this->b64URL;
        elseif ($this->convert and $this->isHTTP($this->url)) {
            $mimey = new MimeTypes();

            if ($mime = $mimey->getMimeType(pathinfo($this->url, PATHINFO_EXTENSION))) {
                $client = new Client();
                try {
                    $response = $client->request('GET', $this->url);
                    if ($response->getStatusCode() === 200) {
                        $body = $response->getBody();
                        $body->rewind();
                        if (!empty($contents = $body->getContents())) {
                            $this->changed = true;
                            return $this->b64URL = sprintf('data:%s;base64,%s', $mime, base64_encode($contents));
                        }
                    }
                } catch (Throwable $error) {

                }
            }
        }

        return null;
    }

    public function getIterator() {
        yield [$this->name, $this->getBase64URL() ?? $this->url, 0];
    }

    public function jsonSerialize() {

        return [
            'url' => $this->getURL(),
            'base64URL' => $this->getBase64URL()
        ];
    }

    public function __toString() {
        return $this->getBase64URL() ?? $this->url;
    }

}
