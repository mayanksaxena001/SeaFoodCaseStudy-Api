var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var dotenv = require('dotenv');
dotenv.load();
var path = require('path');
var expressConfig = require('./config/express');
var router = require('./routes/router');

class Server {
    constructor() {
        this.app = express();
        this.env=process.env;
        this.init();
    }

    init() {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json({strict:false}));
        // this.app.use(express.bodyParser());
        // HTTP request logger
        this.app.use(morgan('dev'));
        // this.app.use((err, req, res, next) => {
        //     console.log(req);
        //     if (err) {
        //         console.error(err.stack);
        //         res.send(err);
        //     } else {
        //         next();
        //     }
        // })
        this.app.use(express.static(path.join(__dirname, '/public')));
        // express settings
        //for now views are integrated in express only
        expressConfig(this.app);
        //router settings
        router(this.app);
        // start server
        this.app.listen(this.env.SERVER_PORT, this.env.SERVER_HOST, () => {
            // connect to database
            console.log(`[Server] listening on  ${this.env.SERVER_HOST} : ${this.env.SERVER_PORT}`);
        });
    }
}
module.exports = new Server().app;
