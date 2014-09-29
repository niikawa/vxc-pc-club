var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * project modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "projects"
 */
var collection = 'projects';

/**
 * project Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class projectModel
 * @constructor
 * @extends Core
 */
var projectModel = function projectModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(projectModel, Core);

/**
 * プロジェクトを保持するコレクション.
 * 
 * @property projectsSchema
 * @type {Object}
 */
var projectsSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  type: { type: mongoose.Schema.Types.ObjectId, ref: 'projectType', default: null},
  name: String,
  description: {type: String},
  begin:{type: Date, default: null},
  end: {type: Date, default: null},
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, projectsSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
projectsSchema.pre('save', function (next) {
    
    next();
});

/**
 * プロジェクトを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
projectModel.prototype.save = function(id, data, callback) {
    
    var project = new myModel(data);
    project.creatBy = id;
    project.updateBy = id;
    project.save(callback);
};

/**
 * プロジェクトを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {String} name
 * @return String|
 */
projectModel.prototype.update = function(id, data, callback) {
    
    var project = this.db.model(collection);
    project.findOne({_id:data._id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.type = data.type;
            target.name = data.name;
            target.save(callback);
        }
    });
};

module.exports = projectModel;