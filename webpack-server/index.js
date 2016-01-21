var Webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

module.exports = function() {
    var compiler = Webpack(webpackConfig);
    
    compiler.plugin("compile", function() {
        console.log("Bundling...");
    });
    
    compiler.plugin("done", function() {
        console.log("Bundle complete");
    });
    
    var bundler = new WebpackDevServer(compiler, {
        contentBase: "../dist",
        publicPath: "/dist/",
        hot: true,
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        }
    });
    
    bundler.listen(8080, "localhost", function() {
        console.log("Bundling project, please wait...");
    });
};
