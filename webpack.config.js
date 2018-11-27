'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var PATHS = {
    main: path.join(__dirname, 'app', 'client.js'),         // app folder: source code
    build: path.join(__dirname, 'build'),                   // build folder: bundle code
    style: [
        path.join(__dirname, 'app', 'styles', 'main.css'),
    ]
};

module.exports = {
    mode:'development',
    devtool: 'eval-source-map',
    entry: {
        main: [
            'webpack-hot-middleware/client?reload=true',
            PATHS.main
        ]
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            filename: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'global.GENTLY': false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        })
    ],
    module: { 
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },

            { test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=100000' },
            {
                test: /\.svg$/,
                use: [
                    'url-loader',
                    'svg-fill-loader'
                ]
            }
        ]
    },
    node: {
        __dirname: true,
        fs: 'empty',
        tls:'empty'
    }
};
