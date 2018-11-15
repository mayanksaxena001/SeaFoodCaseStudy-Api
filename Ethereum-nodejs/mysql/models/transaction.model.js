var Sequelize = require('sequelize');
var SequelizeModel = require('./SequelizeModel');
module.exports = class Transaction extends SequelizeModel {
    constructor(sequelize) {
        super(sequelize);
        this.init();
    }

    init() {
        this.transaction = this.sequelize.define('transaction', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            senderAccount: {
                type: Sequelize.STRING,
            },
            buyerAccount: {
                type: Sequelize.STRING,
            },
            senderEntityId: {
                type: Sequelize.STRING,
            },
            buyerEntityId: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.STRING,
            },
            quantity: {
                type: Sequelize.STRING,
            },
            blockHash: {
                type: Sequelize.STRING,
            },
            transactionHash: {
                type: Sequelize.STRING,
            },
            blockNumber: {
                type: Sequelize.STRING,
            }
        });
    }
}