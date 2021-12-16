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


        <table>
            <caption>Scripts</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>link</th>
                </tr>
            </thead>
            <?php foreach ($scripts as $item): ?>
                <tr>
                    <td><?= $item->name ?></td>
                    <td><?= $item->description ?></td>
                    <td><a href="<?= $item->link ?>">Link</a></td>
                </tr>
            <?php endforeach; ?>

        </table>

        <footer>
            <p>&COPY; 2021 NGSOFT</p>
        </footer>
    </body>
</html>
