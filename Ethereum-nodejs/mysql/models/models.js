var Promise = require( 'bluebird');
var User  = require( './user.model');
// var Transaction  = require( './transaction.model');
var sequelize = require( '../../config/database.seq.config');

const user = new User(sequelize).user;
// const transaction = new Transaction(sequelize).transaction;
sequelize.sync({ force: false });

// user.hasMany(todo,{foreignKey: 'user_id',sourceKey: 'id',onDelete:'CASCADE'});
module.exports = {user};
