const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const babelLoader = require('babel-loader');

const PORT = 8010;

let server;

module.exports = {
    start: (servePath, cb) => {

        const config = {
            entry: {
                app: [path.resolve(__dirname, 'node_modules/webpack/hot/dev-server'), `${servePath}/app.js`]
            },
            resolve: {
                extensions: ['.js', '.coffee']
            },
            mode: 'development',
            target: 'web',
            output: {
                path: servePath,
                filename: 'bundle.js'
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        loader: path.resolve(__dirname, 'node_modules/babel-loader'),
                        options: {
                            babelrc: false,
                            presets: [path.resolve(__dirname, 'node_modules/@babel/preset-env')],
                            plugins: [
                                [path.resolve(__dirname, 'node_modules/@babel/plugin-proposal-decorators'), {legacy: true}],
                                path.resolve(__dirname, 'node_modules/@babel/plugin-proposal-class-properties')
                            ]
                        }
                    },
                    {
                        test: /\.coffee$/,
                        use: [path.resolve(__dirname, 'node_modules/coffee-loader')]
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

