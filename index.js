const gm = require('gm').subClass({ imageMagick: true });

const express = require('express');
const app = express();
const port = 3000;


app.get('/api/:name', (req, res) => {

    // creating an image
    gm(200, 200, "#ddff99f3")
        .drawText(20, 50, `Hello, ${(req.params.name || "Visitor")} !\nThe time is now\n${new Date().toLocaleString()}`)
        .toBuffer('jpg', (err, buffer) => {
            res.contentType('jpeg');
            res.end(buffer, 'binary');
        });

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
