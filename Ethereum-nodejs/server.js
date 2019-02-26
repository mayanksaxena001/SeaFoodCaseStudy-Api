var express = require('express');
var morgan = require('morgan');
var dotenv = require('dotenv');
var path = require('path');
var expressConfig = require('./config/express');
var auth = require('./controllers/AuthController');
var sequelize = require('./config/database.seq.config');
var config = require('./config/config.json');
var router = require('./routes/router');
const env = process.env.NODE_ENV || "development";

class Server {
    constructor() {
        this.app = express();
        this.config = config[env];
        this.init();
    }

    init() {
        dotenv.load();
        // HTTP request logger
        this.app.use(morgan('dev'));
        this.app.use((err, req, res, next) => {
            if (err) {
                console.error(err.stack);
                res.send(err);
            } else {
                next();
            }
        })
        this.app.use(express.static(path.join(__dirname, '/public')));
        // express settings
        //for now views are integrated in express only
        expressConfig(this.app);
        //router settings
        router(this.app);
        // start server
        this.app.listen(this.config.port,'0.0.0.0', () => {
            // connect to database
            console.log(`[Server] listening on port ${this.config.port}`);
        });
    }
}
module.exports = new Server().app;
