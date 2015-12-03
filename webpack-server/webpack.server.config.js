var path = require("path");
var webpack = require("webpack");

module.exports = {
    target: "node",
    externals: "node_modules",
    entry: "./server",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "server-es5.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader?presets[]=es2015",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ["", ".js"]
    }
};
