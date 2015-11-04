"use strict";

var express = require("express"),
http = require("http"),
routes = require("./routes");

var app = express();
var port = process.env.PORT || 3000;

app.get("/", routes.index);
app.use("/", express.static(__dirname + "/public/"));

http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});
