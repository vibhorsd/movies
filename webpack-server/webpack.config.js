var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        app: [
            "webpack-dev-server/client?http://localhost:8080",
            "webpack/hot/only-dev-server",
            "./client"
        ],
        vendor: ["react", "react-dom", "redux", "react-redux", "redux-thunk", "react-hot-loader"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/dist/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js", Infinity)
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ["react-hot", "babel-loader?presets[]=es2015,presets[]=react"],
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
};
