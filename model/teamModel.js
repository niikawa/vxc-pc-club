var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * team modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "teams"
 */
var collection = 'teams';

/**
 * team Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class teamModel
 * @constructor
 * @extends Core
 */
var teamModel = function teamModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(teamModel, Core);

/**
 * チームを保持するコレクション.
 * 
 * @property teamsSchema
 * @type {Object}
 */
var teamsSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  member: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'projects', default: null},
  name: {type: String},
  description: {type: String},
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, teamsSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
teamsSchema.pre('save', function (next) {
    
    next();
});

/**
 * 全チームを取得する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
teamModel.prototype.getAll = function(callback) {
    
    var Team = this.db.model(collection);
    Team.find().sort({'created': 1}).populate('project').populate('member').exec(callback);
};


/**
 * チームを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
teamModel.prototype.save = function(id, data, callback) {
    
    var team = new myModel(data);
    team.creatBy = id;
    team.updateBy = id;
    team.save(callback);
};

/**
 * チームをコピーする.
 * 
 * @method copy
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
teamModel.prototype.copy = function(id, data, callback) {
    
    var team = this.db.model(collection);
    team.findOne({_id:data._id},function(err, target){
        
        if(err || target === null) {
            
            callback('コピー元チームが見つかりません');
        } else {
            
            var copyTeam = new myModel(data);
            copyTeam.creatBy = id;
            copyTeam.updateBy = id;
            copyTeam.member = target.member;
            copyTeam.save(callback);
        }
    }); 
};

/**
 * チームを更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @return String|
 */
teamModel.prototype.update = function(id, data, callback) {
    
    var team = this.db.model(collection);
    team.findOne({_id:data._id},function(err, target){
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.project = data.project;
            target.member = data.member;
            target.name = data.name;
            target.description = data.description;
            target.save(callback);
        }
    });
};

module.exports = teamModel;