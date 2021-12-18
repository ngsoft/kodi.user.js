<!DOCTYPE html>
<html>
    <head>
        <title><?= $package->name ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css">
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
                        <td data-label="Proxy">
                            <a target="_blank" href="/<?= $config->destination ?>/<?= $item->getFileName()->getUserScript() ?>">
                                /<?= $config->destination ?>/<?= $item->getFileName()->getUserScript() ?>
                                <span class="icon-link"></span>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>

            </table>
        </div>



        <footer>
            <p style="text-align: center;">&COPY; <?= gmdate('Y') ?> NGSOFT</p>
        </footer>
    </body>
</html>
