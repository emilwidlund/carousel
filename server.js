const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');

const PORT = 8010;

module.exports = (servePath, cb) => {

    const config = {
        entry: `${servePath}/Main.js`,
        mode: 'development',
        target: 'electron-renderer',
        output: {
            path: servePath,
            filename: 'bundle.js'
        }
    }

    const options = {
        contentBase: servePath,
        inline: true,
        hot: true
    };

    const server = new WebpackDevServer(webpack(config), options);

    server.listen(PORT, 'localhost', (err) => {
        if (err) return console.error(err);

        console.log('Serrver running on port', PORT);

        cb();
    });
}