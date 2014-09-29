var async = require('async');
var logger = require('../util/logger');
var messages = require('../config/messages.js');
/**
 * core model class
 * 
 * @author niikawa
 * @namespace model/core
 * @class coreModel
 * @constructor
 */
var coreModel = function coreModel(modelName) {

    this.modelName = modelName;
    this.db = require('mongoose');
};

/**
 * コレクションの値をすべて取得する.
 * createdの昇順で取得.
 * 
 * @author niikawa
 * @method getAllSync
 * @param {Function} callback
 */
coreModel.prototype.getAll = function(callback){
    var target = this.db.model(this.modelName);
    target.find({}, callback).sort( { 'created' : 1} );
};

/**
 * _idに合致した情報を取得する.
 * 
 * @author niikawa
 * @method getById
 * @param {Object} id
 * @param {Function} callback
 */
coreModel.prototype.getById = function(id, callback){
    var target = this.db.model(this.modelName);
    target.findOne({'_id':id}, callback);
};

/**
 * POSTされたリクエスト値から対象のコレクションにデータを登録する
 * 
 * @author niikawa
 * @method save
 * @param {Object} req
 * @param {Function} callback
 */
 /*
coreModel.prototype.save = function(req, callback){

    var target = this.db.model(this.modelName);
    target.isSameName(req.body.name, function(isSame) {
        
        var message = '';
        if (isSame) {
            
            message = messages.COM_ERR_005;
            //同一名称のものが存在した場合は再度データを取得しクライアント側へ返却する
            async.waterfall(
                [function (callback) {
                    
                    target.getAll(callback);
                }]
                ,function(err, itemList) {
                    
                    if (err) {
                        message = messages.COM_ERR_001;
                        logger.appError(err);
                    }
                    callback(message, itemList);
                }
            );

        } else {
            
            var Collection = new target(req.body);
            Collection.creatBy = req.session._id;
            Collection.updateBy = req.session._id;
            Collection.save(callback);
        }
    });
};
*/

coreModel.prototype.getCollectionName = function() {
    
    return this.modelName;
};

/**
 * 件数を取得する
 * @author niikawa
 * @method count
 * @param {Function} callback
 */
coreModel.prototype.count = function(callback) {
    
    var target = this.db.model(this.modelName);
    target.find().count(callback);
};
/**
 * _idに合致したコレクションを更新する
 * 
 * @author niikawa
 * @method update
 * @param {Object} req
 * @param {Function} callback
 */
/*
coreModel.prototype.update = function (req, callback) {
    var target = this.db.model(this.modelName);
    target.findOne({_id:req.body._id},function(err, target){
    if(err || target === null){return;}
        //TODO コレクションのモデルを動的にここで判定できるのか？
        target.save(callback);
    });
};
*/
/**
 * _idに合致したコレクションを削除する
 * 
 * @author niikawa
 * @method remove
 * @param {Object} _id
 * @param {Function} callback
 */
coreModel.prototype.remove = function(_id, callback){
    
    var target = this.db.model(this.modelName);
    target.findByIdAndRemove(_id, callback);
};

/**
 * 同一のnameを持つものが存在するかを判定する.
 * 
 * @method isSameName
 * @author niikawa
 * @param {String} name
 * @param {Function} callback
 * @return bool
 */
coreModel.prototype.isSameName = function(id, name, callback) {
    
    var target = this.db.model(this.modelName);
    var querty = (null === id) ? {name:name} : {$and: [{_id : { $ne : id} }, { name : name }]};

    target.findOne( querty ,function(err, item){
        
        if (null === item) {
            
            callback(false, null, null);
            
        } else {
            
            var message = messages.COM_ERR_005;
            //同一名称のものが存在した場合は再度データを取得しクライアント側へ返却する
            async.waterfall(
                [function (callback) {
                    
                    target.find({}, callback).sort( { 'created' : 1} );
                }]
                ,function(err, itemList) {
                    
                    if (err) {
                        message = messages.COM_ERR_001;
                        logger.appError(err);
                    }
                    callback(true, message, itemList);
                }
            );
        }
    });
};


//モジュール化
module.exports = coreModel;