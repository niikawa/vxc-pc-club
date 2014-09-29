var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * rank modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "ranks"
 */
var collection = 'ranks';

/**
 * rank Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class rankModel
 * @constructor
 * @extends Core
 */
var rankModel = function rankModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(rankModel, Core);

/**
 * ランクを保持するコレクション.
 * 
 * @property ranksSchema
 * @type {Object}
 */
var ranksSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: {type: String},
  description:{type: String},
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, ranksSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
ranksSchema.pre('save', function (next) {
    
    next();
});

/**
 * ランクを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} category categoryModel
 * @param {String} responders
 * @param {Function} callback
 */
rankModel.prototype.save = function(id, data, callback) {
    
    var My = new myModel(data);
    My.creatBy = id;
    My.updateBy = id;
    My.save(callback);
};

/**
 * ランクを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String
 */
rankModel.prototype.update = function(id, data, callback) {
    
    var My = this.db.model(collection);
    My.findOne({_id:data._id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.name = data.name;
            target.description = data.description;
            target.save(callback);
        }
    });
};

module.exports = rankModel;