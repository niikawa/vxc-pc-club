var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * role modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "roles"
 */
var collection = 'roles';

/**
 * Skill Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class skillModel
 * @constructor
 * @extends Core
 */
var rolelModel = function roleModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(roleModel, Core);

/**
 * ロールを保持するコレクション.
 * 
 * @property rolesSchema
 * @type {Object}
 */
var rolesSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'skillCategory' },
  name: String,
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, rolesSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
rolesSchema.pre('save', function (next) {
    
    next();
});

/**
 * skillを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} category categoryModel
 * @param {String} responders
 * @param {Function} callback
 */
roleModel.prototype.save = function(id, category, name, callback) {
    
    var Skill = new myModel();
    Skill.creatBy = id;
    Skill.updateBy = id;
    Skill.category = category;
    Skill.name = name;
    Skill.save(callback);
};

/**
 * 指定したカテゴリIDを持つskillを削除する.
 * 
 * @method remov
 * @author niikawa
 * @param {Object} _id roleModel.id
 * @param {Function} callback
 */
roleModel.prototype.remove = function(_id, callback) {
    
    var Skill = this.db.model(collection);
    Skill.remove({'category': _id}, callback);
};

/**
 * ロールを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String|
 */
roleModel.prototype.update = function(data, callback) {
    
    var Skill = this.db.model(collection);
    Skill.findOne({_id:data._id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = data.userId;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.name = data.name;
            target.save(callback);
        }
    });
};

module.exports = skillModel;