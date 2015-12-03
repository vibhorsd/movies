import React from "react";
import ReactDOMServer from "react-dom/server";
import Root from "../../client/components/Root";

export default function (req, res) {
    var markup = "<!DOCTYPE html>"
    markup += "<html>";
    markup += "<head>";
    markup += "<title>Movie app</title>";
    markup += "</head>";
    markup += "<body>";
    markup += "<div id=\"root\">";
    markup += ReactDOMServer.renderToString(<Root />);
    markup += "</div>";
    markup += "<script src=\"/dist/vendor.bundle.js\"></script>";
    markup += "<script src=\"/dist/bundle.js\"></script>";
    markup += "</body>";
    markup += "</html>";
    res.send(markup);
}
