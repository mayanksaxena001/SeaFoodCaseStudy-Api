var exphbs = require('exphbs');
var Handlebars = require('hbs');
var cors = require('cors');
var sequelize = require('./database.seq.config');
module.exports = (app) => {
    console.log('Setting cors options in server');
    const whitelist = ['http://localhost:4200', 'http://localhost:8001','https://demo.xftchain.club'];
    const allowedheaders = ["Origin, X-Requested-With", "Content-Type", "Accept","x-access-token"];
    const exposedheaders = ["x-access-token"];
    const methods = ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'];
    var corsOptions = {
        origin: whitelist,
        methods: methods,
        allowedHeaders: allowedheaders,
        exposedHeaders: exposedheaders,
        credentials: false,
        maxAge: 84000,
        // preflightContinue: true,
        optionsSuccessStatus: 200
    }
    app.use('*', cors(corsOptions)); // preflight OPTIONS; put before other routes
    // app.use((req, res, next) => {
    //     res.header("Access-Control-Allow-Origin", whitelist);
    //     res.header("Access-Control-Allow-Headers", allowedheaders);
    //     res.header("Access-Control-Expose-Headers", exposedheaders);
    //     res.header('Access-Control-Allow-Methods', methods);
    //     res.header('Content-Type', 'application/json');
    //     next();
    // });
    app.get('/', function (req, res) {
        res.render('main');
    });
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    app.set('views', __dirname + '/../views')
    app.engine('html', exphbs);
    app.set('view engine', '.html');
};