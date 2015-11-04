import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import path from "path";
import App from "./components/App";

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.get("/favicon.ico", (req, res) => res.send(""));

app.use((req, res) => {
    var markup = "<!DOCTYPE html>";
    markup += "<html>";
    markup += "<head>";
    markup += "<title>Movies app</title>";
    markup += "<link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>";
    markup += "</head>";
    markup += "<body>";
    markup += "<div id=\"app\" class=\"container\">";
    markup += ReactDOMServer.renderToString( < App / > );
    markup += "</div>";
    markup += "<script src=\"bundle.js\"></script>";
    markup += "</body>";
    markup += "</html>";
    res.send(markup);
});

const port = process.env.PORT || 3000;
app.listen(port);
