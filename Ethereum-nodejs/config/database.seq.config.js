var Sequelize = require( 'sequelize');
var Promise = require( 'bluebird');
const env = process.env;
class Database {
    constructor() {
        this.env = env;
        this.sequelize = new Sequelize(this.env.DB_SCHEMA,this.env.DB_USERNAME, this.env.DB_PASSWORD, {
            "dialect": "mysql",
            "pool": {
                "max": 25,
                "min": 0,
                "acquire": 30000,
                "idle": 10000
            } ,
            "host": this.env.DB_URL_HOST,
            "port": this.env.DB_URL_PORT
        });
        this.init();
    }

    init() {
        this.sequelize.Promise = Promise;
        this.sequelize
            .authenticate()
            .then(() => {
                console.log('Database connection has been established successfully. {}');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

    }
}
module.exports = new Database().sequelize;