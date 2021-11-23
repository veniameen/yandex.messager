const express = require('express');
const server = express();
const PORT = process.env.PORT || 3000;

const routes = ['login', '404', '500', 'change-password', 'change-profile', 'chat', 'index', 'profile', 'registration'];
const dir = `${__dirname}/dist`;

server
    .use(express.static('./dist'))
    .get('/:page', function(req, res) {
        page = req.params.page;

        try {
            if(routes.includes(page)){
                res.status(200).sendFile(`${dir}/${page}.html`, 200);
            }else{
                res.status(404).sendFile(`${dir}/404.html`, 404);
            }
        } catch (error) {
            res.status(500).sendFile(`${dir}/500.html`, 500);
        }
    });

    server.listen(PORT, () => {
        console.log(`✅ Express server running on port ${PORT}!`)
    })