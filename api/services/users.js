"use strict";

const ObjectId = require('mongodb').ObjectId;

class UsersService {
    constructor(database, pwManager) {
        this.collection = database.db.collection('users');
        this.pwManager = pwManager;
    }
    async create(createUserDto) {
        const hashedPassword = this.pwManager.hash(createUserDto.password);
        return await this.collection.insertOne({...createUserDto, password: hashedPassword});
    }
    
    findByUsername(username) {
        return this.collection.findOne({username});
    }

    async addExchange(userId, createExchangeDto) {
        const id = ObjectId();
        await this.collection.updateOne({_id: ObjectId(userId)}, {$push: {exchanges: {...createExchangeDto, id}}});
        return id;
    }

    updateExchange(userId, exchangeId, updateExchangeDto) {
        const objectExchangeId = ObjectId(exchangeId);
        return this.collection.updateOne(
            {_id: ObjectId(userId), 'exchanges._id': objectExchangeId},
            {$set: {'exchanges.$': {...updateExchangeDto, _id: objectExchangeId}}}
        );
    }

    deleteExchange(userId, exchangeId) {
       return this.collection.updateOne({_id: ObjectId(userId)}, {$pull: {exchanges: {_id: ObjectId(exchangeId)}}});
    }

    async getExchanges(userId) {
        return (await (this.collection.findOne({_id: ObjectId(userId)}, {exchanges: 1}))).exchanges || [];
    }
}

module.exports = UsersService;