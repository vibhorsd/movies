var express = require("express");
var path = require("path");
var httpProxy = require("http-proxy");
var proxy = httpProxy.createProxyServer();

var app = express();

var isProduction = (process.env.NODE_ENV === "production");
var port = isProduction ? process.env.PORT : 3000;

var publicPath = path.resolve(__dirname, "client");
app.use(express.static(publicPath));

if (!isProduction) {
    var webpackServer = require("./webpackServer");
    webpackServer();
    
    app.all("/dist/*", function(req, res) {
        proxy.web(req, res, {
            target: "http://localhost:8080"
        });
    });
}
app.listen(port, function() {
    console.log("Server running on port " + port);
});
