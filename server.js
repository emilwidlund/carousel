const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const PORT = 8010;

let server;

module.exports = {
    start: (servePath, cb) => {

        const config = {
            entry: {
                app: ['webpack/hot/dev-server', `${servePath}/app.js`]
            },
            resolve: {
                extensions: ['.js', '.coffee']
            },
            mode: 'development',
            target: 'electron-renderer',
            output: {
                path: servePath,
                filename: 'bundle.js'
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: ['@babel/preset-env'],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', {legacy: true}],
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    },
                    {
                        test: /\.coffee$/,
                        use: ['coffee-loader']
                    }
                ]
            },
            plugins: [new webpack.HotModuleReplacementPlugin()]
        }

        const options = {
            contentBase: servePath
        };

        server = new WebpackDevServer(webpack(config), options);


        return server.listen(PORT, 'localhost', (err) => {
            if (err) return console.error(err);
        
            console.log('Serrver running on port', PORT);
        
           if (cb) cb();
        });
    },
    close: () => {
        return server.close();
    }
}

