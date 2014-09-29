var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * skillCategoryModel modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "skillCategory"
 */
var collection = 'skillCategory';

/**
 * skillCategory Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class skillModel
 * @constructor
 * @extends Core
 */
var skillCategoryModel = function skillCategoryModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(skillCategoryModel, Core);

/**
 * スキルカテゴリを保持するコレクション.
 * 
 * @property skillCategorySchema
 * @type {Object}
 */
var skillCategorySchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: String,
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, skillCategorySchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
skillCategorySchema.pre('save', function (next) {
    
    next();
});

/**
 * スキルカテゴリを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 */
skillCategoryModel.prototype.save = function(id, name, callback) {
    
    var Category = new myModel();
    Category.creatBy = id;
    Category.updateBy = id;
    Category.name = name;
    Category.save(callback);
};

/**
 * スキルカテゴリを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String|
 */
skillCategoryModel.prototype.update = function(id, data, callback) {
    
    var Category = this.db.model(collection);
    Category.findOne({_id:id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.name = data.name;
            target.save(callback);
        }
    });
};

module.exports = skillCategoryModel;