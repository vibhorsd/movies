var webpack = require('webpack');

module.exports = {
    entry: {
        app: './public/index.js',
        vendor: ["react", "react-dom", "redux", "react-redux","redux-thunk","react-hot-loader"]
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin()
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js",Infinity)
    ]
};
