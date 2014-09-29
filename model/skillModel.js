var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * skill modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "skills"
 */
var collection = 'skills';

/**
 * Skill Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class skillModel
 * @constructor
 * @extends Core
 */
var skillModel = function skillModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(skillModel, Core);

/**
 * スキルを保持するコレクション.
 * 
 * @property skillsSchema
 * @type {Object}
 */
var skillsSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'skillCategory' },
  name: String,
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, skillsSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
skillsSchema.pre('save', function (next) {
    
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
skillModel.prototype.save = function(id, category, name, callback) {
    
    var Skill = new myModel();
    Skill.creatBy = id;
    Skill.updateBy = id;
    Skill.category = category;
    Skill.name = name;
    Skill.save(callback);
};

/**
 * 指定したカテゴリIDを持つskillを取得する.
 * 
 * @method getByCategoryId
 * @author niikawa
 * @param {Object} _id categoryModel.id
 * @param {Function} callback
 */
skillModel.prototype.getByCategoryId = function(_id, callback) {
    
    var Skill = this.db.model(collection);
    Skill.find({'category': _id}, callback).sort( { 'created' : 1} );
};

/**
 * 指定したカテゴリIDを持つskillを削除する.
 * 
 * @method removeByCategoryId
 * @author niikawa
 * @param {Object} _id categoryModel.id
 * @param {Function} callback
 */
skillModel.prototype.removeByCategoryId = function(_id, callback) {
    
    var Skill = this.db.model(collection);
    Skill.remove({'category': _id}, callback);
};

/**
 * スキルを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String|
 */
skillModel.prototype.update = function(id, data, callback) {
    
    var Skill = this.db.model(collection);
    Skill.findOne({_id:data._id},function(err, target){
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


/**
 * 全カテゴリと属したスキルを取得する
 * 
 * @method getSkillsBeloginToCategory
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
skillModel.prototype.getSkillsBeloginToCategory = function(callback) {
    
    var Skill = this.db.model(collection);
    Skill.aggregate( [ {$group: { _id : "$category"} }, {$sort: {_id: 1} }], function(err, categories) {
        
        var list = [];
        Skill.find({}, null, {sort:{'category': 1}}).populate('category').exec(function(err, skills) {

            var categoryNum = categories.length;
            var sIndex = 0;
            var skillNum = skills.length;
            for (var cIndex=0; cIndex < categoryNum; cIndex++) {
                
                var skillList = [];
                var cId = String(categories[cIndex]._id);
                for (sIndex; sIndex < skillNum; sIndex++) {
                    var sId = String(skills[sIndex].category._id);
                    if (cId !== sId) {
                        
                        break;
                    }
                    
                    skillList.push({_id: skills[sIndex]._id, name: skills[sIndex].name});
                }
                var category = skills[sIndex-1].category;
                list.push(
                    { 
                        category: {_id: category._id, name:category.name}, 
                        skills: skillList
                    }
                );
            }
            callback(null, list);
        });
    });
    
};

module.exports = skillModel;