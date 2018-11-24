var {account} = require( '../models/models');
module.exports =  class AccountRepository {
    constructor() { }

    async update(data, id) {
        data.updatedAt = new Date();
        return await account.find({ where: { id: id } }).then(u => u.update(data));
    };
    async remove(id) {
        return await account.destroy({ where: { id: id } });
    };
    async getById(id) {
        return await account.find({ where: { id: id } });
    };
    async getAll() {
        return await account.find().then(u => {return u;});
    };
    async create(data) {
        return await account.create(data);
    };
    
}