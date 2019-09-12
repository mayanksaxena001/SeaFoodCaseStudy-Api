var Promise = require( 'bluebird');
var User  = require( './user.model');
var Account  = require( './account.model');
var ApiToken = require('./apitoken.model');
// var Transaction  = require( './transaction.model');
var sequelize = require( '../../config/database.seq.config');

const user = new User(sequelize).user;
const apiToken = new ApiToken(sequelize).apitoken;
// const account = new Account(sequelize).account;
// const transaction = new Transaction(sequelize).transaction;
sequelize.sync({ force: false });
apiToken.belongsTo(user,{foreignKey: 'user_id', targetKey: 'id',onDelete:'CASCADE'});
// user.hasMany(todo,{foreignKey: 'user_id',sourceKey: 'id',onDelete:'CASCADE'});
module.exports = {user,apiToken};
