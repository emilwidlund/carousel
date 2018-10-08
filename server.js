const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const PORT = 8010;

module.exports = (servePath, cb) => {

    const config = {
        entry: {
            app: ['webpack/hot/dev-server', `${servePath}/Main.js`]
        },
        mode: 'development',
        target: 'electron-renderer',
        output: {
            path: servePath,
            filename: 'bundle.js'
        },
        plugins: [new webpack.HotModuleReplacementPlugin()]
    }

    const options = {
        contentBase: servePath
    };

    const server = new WebpackDevServer(webpack(config), options);

    server.listen(PORT, 'localhost', (err) => {
        if (err) return console.error(err);

        console.log('Serrver running on port', PORT);

        cb();
    });
}