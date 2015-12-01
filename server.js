var express = require('express');
var app = express();
var path = require('path');
var env = process.env.NODE_ENV || "development";

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    if (env === "development") {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    }
    else {
        res.sendFile(path.join(__dirname, "public", "indexSimple.html"));
    }
    
});

var port = 9000;
if (env === "development") {
    port = 3000;
}

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});
