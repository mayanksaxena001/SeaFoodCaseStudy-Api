var {transaction} = require( '../models/models');
module.exports =  class TransactionRepository {
    constructor() { }

    async update(data, id) {
        return await transaction.find({ where: { senderAccount: id } }).then(u => u.update(data));
    };
    async remove(id) {
        return await transaction.destroy({ where: { id: id } });
    };
    async getById(id) {
        return await transaction.find({ where: { id: id } });
    };
    async getByAccountId(id) {
        return await transaction.find({ where: { senderAccount: id } });
    };
    async getAll() {
        return await transaction.find().then(u => {return u;});
    };
    async create(data) {
        return await transaction.create(data);
    };
    
}