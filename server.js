const express = require('express');

const PORT = 8010;

module.exports = (servePath, cb) => {
    const app = express();
    
    app.use('/', express.static(servePath));

    app.listen(PORT, () => {
        console.log(`Server now running on port ${PORT}`);
        if (cb) cb();
    });
}