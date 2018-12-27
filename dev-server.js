const liveServer = require('live-server');

let params = {
    port: 3000,
    root: "./public",
    open: false,
};
liveServer.start(params);