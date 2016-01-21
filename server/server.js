import express from "express";
import path from "path";
import httpProxy from "http-proxy";
import handleRoutes from "./routes";
import {store, storeDispatcher} from "./store";
import {connect} from "./store/server_actions";
import logger from "./logger";

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

    var actionConnect = connect();
    var promise = storeDispatcher(actionConnect);
    promise.then((value) => {
        logger.info("[Store Connected]");
        app.listen(port, function() {
            logger.info("Server running on port " + port);
        });
    }).catch((err) => {
        logger.error("[Store Connection Error]");
    })

}
