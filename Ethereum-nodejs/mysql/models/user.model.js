var Sequelize = require('sequelize');
var SequelizeModel = require('./SequelizeModel');
module.exports = class User extends SequelizeModel {
    constructor(sequelize) {
        super(sequelize);
        this.init();
    }

    init() {
        this.user = this.sequelize.define('user', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: true
                },
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            account: {
                type: Sequelize.STRING,
                // TODO:For time being,allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            //to check if token is there or not TODO : already done , can be used for profile deletion !
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            balance: {
                type: Sequelize.STRING,
                // TODO:For time being,allowNull: false
                defaultValue: '0'
            },
            mnemonic: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
    }
}