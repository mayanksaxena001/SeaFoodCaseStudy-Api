var bodyParser = require('body-parser');
var exphbs = require('exphbs');
var Handlebars = require('hbs')
module.exports = (app) => {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        type: "*/*"
    }));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
    app.set('views', __dirname + '/../views')
    app.engine('html', exphbs);
    app.set('view engine', '.html');
};