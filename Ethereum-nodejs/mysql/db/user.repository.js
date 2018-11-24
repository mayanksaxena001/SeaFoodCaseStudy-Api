var {user} = require( '../models/models');
module.exports = class UserRepository {
    constructor() { }

    update(data, id) {
        data.updatedAt = new Date();
        return user.find({ where: { id: id } }).then(u => u.update(data));
    };
    remove(id) {
        return user.destroy({ where: { id: id } });
    };
    async getById(id) {
        return await user.find({ where: { id: id } });
    };
    async getByAddress(address) {
        return await user.find({ where: { account: address } });
    };
    async getByType(_type) {
        return await user.findAll({ where: { type: _type } });
    };
    getAll() {
        return user.find().then(u => {return u;});
    };
    async getAddressDetails(){
        return user.findAll({attributes: ['name', 'account']});
    }
     create(data) {
        return user.create(data);
    };
    findByUserName(username) {
        return user.findOne({
            where: {
                username: username
            }
        })
    }
    
}