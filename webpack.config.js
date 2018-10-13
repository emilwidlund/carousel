const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './src/index.tsx']
    },
    output: {
        filename: 'bundle.js',
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'electron-renderer',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    devServer: {
        contentBase: './dist',
        port: 8000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, 
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader']
            },
            { 
                test: /\.scss$/,
                use: [
                    { 
                        loader: 'style-loader'
                    }, 
                    { 
                        loader: 'css-loader' 
                    }, 
                    { 
                        loader: 'sass-loader'
                    }
                ] 
            }
        ]
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.HotModuleReplacementPlugin, 
        new MonacoWebpackPlugin()
    ]
}