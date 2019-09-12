var {
    apiToken
} = require('../models/models');
module.exports = class ApiTokenRepository {
    constructor() {}

    update(data, id) {
        data.updatedAt = new Date();
        return apiToken.find({
            where: {
                id: id
            }
        }).then(u => u.update(data));
    };
    remove(id) {
        return apiToken.destroy({
            where: {
                id: id
            }
        });
    };
    async getById(id) {
        return await apiToken.find({
            where: {
                id: id
            }
        });
    };
    async getByType(_type) {
        return await apiToken.findAll({
            where: {
                type: _type
            }
        });
    };
    async getByStatus(_type,_active) {
        return await apiToken.findAll({
            where: {
                status: _active
            }
        });
    };
    async getByToken(token) {
        return await apiToken.findAll({
            where: {
                token: _token
            }
        });
    };
    getAll() {
        return apiToken.find().then(u => {
            return u;
        });
    };
    async create(data) {
        return apiToken.create(data);
    };

}