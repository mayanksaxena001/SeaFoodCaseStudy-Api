var Sequelize = require('sequelize');
var SequelizeModel = require('./SequelizeModel');
module.exports = class ApiToken extends SequelizeModel {
    constructor(sequelize) {
        super(sequelize);
        this.init();
    }

    init() {
        this.apitoken = this.sequelize.define('api_token', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            method: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                validate: {
                    isUUID: 4
                }
            },
            //to check if token is there or not
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            token: {

                type: Sequelize.STRING,

                type: Sequelize.TEXT,

                // TODO:For time being,allowNull: false
            },

        });
    }
}