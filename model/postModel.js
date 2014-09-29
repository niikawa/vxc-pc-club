var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * post modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "posts"
 */
var collection = 'posts';

/**
 * post Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class skillModel
 * @constructor
 * @extends Core
 */
var postModel = function postModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(postModel, Core);

/**
 * 役職を保持するコレクション.
 * 
 * @property rolesSchema
 * @type {Object}
 */
var postsSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: {type: String},
  description:{type: String},
  condition:{type: Array},
//  roles:[{type: mongoose.Schema.Types.ObjectId, ref: 'roles'}]
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, postsSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
postsSchema.pre('save', function (next) {
    
    next();
});

/**
 * 役職を登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} category categoryModel
 * @param {String} responders
 * @param {Function} callback
 */
postModel.prototype.save = function(id, data, callback) {
    
    var My = new myModel(data);
    My.creatBy = id;
    My.updateBy = id;
    My.save(callback);
};

/**
 * 役職を更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String
 */
postModel.prototype.update = function(id, data, callback) {
    
    var My = this.db.model(collection);
    My.findOne({_id:data._id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.name = data.name;
            target.description = data.description;
            target.condition = data.condition;
//            target.roles = data.roles;
            target.save(callback);
        }
    });
};

module.exports = postModel;