var Sequelize = require('sequelize');
var SequelizeModel = require('./SequelizeModel');
module.exports = class Account extends SequelizeModel {
    constructor(sequelize) {
        super(sequelize);
        this.init();
    }

    init() {
        this.account = this.sequelize.define('account', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            mnemonic: {
                type: Sequelize.STRING,
            },
            account: {
                type: Sequelize.STRING,
            }
        });
    }
}