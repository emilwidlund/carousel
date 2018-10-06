const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['webpack/hot/dev-server', './src/index.tsx']
    },
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'electron-main',
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
                enforce: 'pre', 
                test: /\.js$/, 
                loader: 'source-map-loader'
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
    plugins: [new webpack.HotModuleReplacementPlugin]
}