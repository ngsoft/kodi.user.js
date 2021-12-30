<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">

        <link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wsBDyUWhBO3cwAAA0FJREFUWMPtl79O21AUxu+JPQQbR7WQErXqEBgTVIwqVZUi4b2K0xdosvAIfQbYu/ACCJQlI6FMllBVQiQaaAJSqmJ1aBXGMEWOff11uaauyR/UQsvAlc5i+dzvd8/1vf4OY/dtACgC2AEwwO2NAYD3AKxJwkkAmwBg23bXMIymoih9IgJj7I+CiKAoSn9paalp23ZXwGwCSI4C2OSc+6VS6YCIgj8VnQATWJZ1wDn3AWyOKjssyzq4beF4WJZ1ICpRjALs2LbdvYuVj6qE2I6dKMDAMIzmXYuHYRhGE8AgCgBFUfr/CkBRlD4AMMYYhQCJRIKJZ3c+iIgFQcCIiBKRKvwT8bhW4i/muZXxAPAAcP8BZFkeqqp6Kcuyf9NJJUnyUqnUpSzL7o0SxK30W8zPz7fr9XrH930fAFzXHW5vb7cymcwXNuaGS6fT3Wq12nJddwgAvu/7e3t7nYWFhVb8XUQvgzhAuVxuBEEAAIcAXgN4CqAC4MzzPL9QKDTiExYKhYbneT6AMwBvADwRf9kPALC6utq8EUAulzsSv8sNAFKsUkkANc/z/HQ63Q1zMpnMFyFei5sNABKAdwCwuLh4NBXg+PjYAbAfF49BnFWr1U9hztbW1hGA7kin8wvCbrfb30KHNRJA07QLsfrClG/mjeu6Q0mShrIse2LPK1NyXgKApmm9sQC6rp8KAylNmewxAKRSqb6qqn0B/XRKjgRgMDc3dxoFuDqGRMQ4548YY0nGWJ5NHi8453wwGMy4rjvDOeeMsedTcvKMsaTruhoRXaND6IAdx+kBqE1ZyeHu7m4n/Abq9XpHnBhpQl7NcZxe6JTjW3BlyUzTbIiSvh0jvhEEAbLZ7EkIkM1mP4tjuzEKAsBbADBNs8HGWLIrU0pEWFtbawqIGoBnQrggTgcqlcq1e6BcLofg++JdSeTWAGB9fb1JRGNN6auoLScirKysNM7Pz79HOhucnJw4uVzuKC4eRj6fb7Vara/RHMdxeqZpNsLjVyqVrttyAXGtMSEiaJr2Q9f1U1VVe+OE4zE7O3uh6/qppmk/QmEiCorF4seRjYkA+K01W15evrXWzDCM6a1ZBOSumtMdTGpO/9f4CY26gJKVH22dAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTExLTAxVDE1OjM3OjIyKzAxOjAwXudprAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMS0wMVQxNTozNzoyMiswMTowMC+60RAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC">
        <title><?= $package->name ?></title>
    </head>
    <body>
        <header>
            <a href="/" class="logo"><?= $package->name ?></a>
        </header>
        <div class="container" style="padding: .75rem;">
            <table class="hoverable" style="overflow: inherit;">
                <caption>Scripts</caption>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Proxy</th>
                        <th>Build</th>
                    </tr>
                </thead>
                <?php if (empty($scripts)): ?>
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            No Scripts
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($scripts as $item): ?>
                        <tr>
                            <td  data-label="Name">
                                <?php if (isset($item->icon)): ?>
                                    <img src="<?= $item->icon ?>" style="max-height: 1.2rem;vertical-align: middle;margin-right: 1.2rem;"/>
                                <?php endif; ?>
                                <?= $item->name ?>
                            </td>
                            <td data-label="Description"><?= $item->description ?></td>
                            <td data-label="Proxy">
                                <a target="_blank" href="<?= $config->proxy->path . $item->getFileName()->getUserScript() ?>">
                                    <?= $config->proxy->path . $item->getFileName()->getUserScript() ?>
                                    <span class="icon-link"></span>
                                </a>
                            </td>
                            <td data-label="Build">
                                <?php if (file_exists($root . DIRECTORY_SEPARATOR . $config->destination . DIRECTORY_SEPARATOR . $item->getFileName()->getUserScript())): ?>
                                    <a target="_blank" href="/<?= $config->destination ?>/<?= $item->getFileName()->getUserScript() ?>">
                                        /<?= $config->destination ?>/<?= $item->getFileName()->getUserScript() ?>
                                        <span class="icon-link"></span>
                                    </a>
                                <?php else: ?>
                                    No Build
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>

            </table>
        </div>



        <footer>
            <p style="text-align: center;">&COPY; <?= gmdate('Y') ?> NGSOFT</p>
        </footer>
    </body>
</html>
