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
        <div class="container">
            <table class="hoverable striped" style="overflow: inherit;">
                <caption>Scripts</caption>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Link</th>
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
                        <td data-label="Link"><a href="<?= $config->proxy->path . $item->getFileName()->getUserScript() ?>"><span class="icon-link"></span>Link</a></td>
                    </tr>
                <?php endforeach; ?>

            </table>
        </div>



        <footer>
            <p>&COPY; 2021 NGSOFT</p>
        </footer>
    </body>
</html>
