import express from "express";
import path from "path";
import httpProxy from "http-proxy";
import handleRoutes from "./routes";
import store from "./store"

export default function() {
    var proxy = httpProxy.createProxyServer();
    var app = express();
    
    var isProduction = (process.env.NODE_ENV === "production");
    var port = isProduction ? process.env.PORT : 3000;
    
    if (!isProduction) {
        var webpackServer = require("../webpack-server");
        webpackServer();
        
        app.all("/dist/*", function(req, res) {
            proxy.web(req, res, {
                target: "http://localhost:8080"
            });
        });
    }
    
    handleRoutes(app);
    
    app.listen(port, function() {
        console.log("Server running on port " + port);
    });
}
