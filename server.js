const express = require('express');
const server = express();
const PORT = process.env.PORT || 3000;

const routes = [
  'login',
  '404',
  '500',
  'change-password',
  'change-profile',
  'chat',
  'index',
  'profile',
  'registration',
];

server
    .use(express.static('./dist'))
    .get(['/', '/:page'], function(req, res) {
      const page = {
        url: req.params.page === undefined ? 'index' : req.params.page,
        status: 404,
      };

      if (page.url.split('.')[1] && page.url.split('.')[1] == 'html') {
        res.redirect(301, `/${page.url.split('.')[0]}`);
        return;
      }

      try {
        if (routes.includes(page.url)) {
          page.status = 200;
        } else {
          page.status = 404;
        }
      } catch (error) {
        page.status = 500;
      }

      res.status(page.status).send(`
            <!DOCTYPE html>
            <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title></title>
                    <link rel="icon" href="images/favicon.png" type="image/png">
                    <link rel="stylesheet" href="/css/app.css">

                </head>
                <body>
                    <div class="app"></div>
                    <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>
                    <script type="module" src="/views/${page.url}/index.js"></script>
                </body>
            </html>
        `);
    });

server.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}!`);
});
