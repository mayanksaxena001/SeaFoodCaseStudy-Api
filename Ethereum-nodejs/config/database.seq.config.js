var Sequelize = require( 'sequelize');
var Promise = require( 'bluebird');
var path = require( 'path');
const env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
class Database {
    constructor() {
        this.database = config.database;
        this.sequelize = new Sequelize(this.database.database, this.database.username, this.database.password, this.database);
        this.init();
    }

    init() {
        this.sequelize.Promise = Promise;
        this.sequelize
            .authenticate()
            .then(() => {
                console.log('Database connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

    }
}
module.exports = new Database().sequelize;