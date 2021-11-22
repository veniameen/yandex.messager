const express = require('express');
const server = express();

const routes = ['auth', '500'];
const dir = `${__dirname}/dist`;

server
    .use(express.static('./dist'))
    .get('/', function(req, res) {
        res.status(200).sendFile(`${dir}/auth.html`, 200);
    })
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

    server.listen(3000, () => {
        console.log("✅ Express server running on port 3000!")
    })