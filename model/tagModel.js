var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * tags modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "tags"
 */
var collection = 'tags';
/**
 * tagを保持するコレクション.
 * 
 * @property chatSchema
 * @type {Object}
 */
var tagsSectenceSchema = new mongoose.Schema({
  created: {type: Date, default: moment().format('YYYY-MM-DD hh:mm:ss')},
  updated: {type: Date, default: moment().format('YYYY-MM-DD hh:mm:ss')},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: {type: String},
  description: {type: String},
  color: {type: String},
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, tagsSectenceSchema);

/**
 * tags Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class tags
 * @constructor
 * @extends Core
 */
var tagsModel = function tagsModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(tagsModel, Core);

/**
 * タグを取得する.
 * 
 * @method getTagAll
 * @author niikawa
 * @param {Number} skip
 * @param {Number} limit
 * @param {Funtion} callback
 */
tagsModel.prototype.getTagAll = function(skip, limit, callback) {
    var Tags = this.db.model(collection);
    Tags.find().sort({'created': 1}).skip(skip).limit(limit).exec(callback);
};
/**
 * タグを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Function} callback
 */
tagsModel.prototype.save = function(id, data,callback) {
    
    data.color = data.color;
    var Tags = new myModel(data);
    Tags.creatBy = id;
    Tags.updateBy = id;
    Tags.save(callback);
};
/**
 * タグを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {String} id user._id
 * @param {Object} data 
 * @param {Function} callback
 */
tagsModel.prototype.update = function(id, data, callback) {
    
    var Tags = this.db.model(collection);
    Tags.findOne({ "_id" : data._id}, function(err, target){
        
        if(err || target === null) {
            
            callback('対象が見つかりません');
        } else {
            
            target.updateBy = data.updateBy;
            target.updated = moment().format('YYYY-MM-DD hh:mm:ss');
            target.name = data.name;
            target.description = data.description;
            target.color = data.color;
            target.save(callback);
        }
    });
};
module.exports = tagsModel;