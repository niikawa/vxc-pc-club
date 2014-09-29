var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * task modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "tasks"
 */
var collection = 'tasks';

/**
 * task Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class taskModel
 * @constructor
 * @extends Core
 */
var taskModel = function teamModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(taskModel, Core);

/**
 * チームを保持するコレクション.
 * 
 * @property tasksSchema
 * @type {Object}
 */
var tasksSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  contents: {type: String},
  comments: {type: Array},
  teams: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', default: null},
  status: {type: Number, default: 1},
  progress: {type: Number, default: 0},
  endDate: {type: Date, default: null},
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, tasksSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
tasksSchema.pre('save', function (next) {
    
    next();
});

/**
 * 自分のタスクを取得する.
 * 
 * @method getMine
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
taskModel.prototype.getMine = function(id, callback) {
    
    var Task = this.db.model(collection);
//    Task.find({userId: id}).sort({'created': 1}).populate('teams').exec(callback);
    Task.find({userId: id}).sort({'created': 1}).exec(callback);
};

/**
 * タスクを登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
taskModel.prototype.save = function(id, data, callback) {
    
    var task = new myModel(data);
    task.creatBy = id;
    task.updateBy = id;
    task.comment = {userId: id, comment: data.comments, date: moment().format('YYYY-MM-DD HH:mm:ss')};
    task.save(callback);
};

/**
 * コメントを進捗を変更する.
 * 
 * @method changeProgress
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
taskModel.prototype.changeProgress = function(id, data, callback) {
    
    var task = this.db.model(collection);
    task.findOne({_id: data._id}, function(err, item)
    {
        if (err || item === null)
        {
            callback();
        }
        else
        {
            item.updateBy = id;
            item.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            item.progress = data.progress;
            item.save(callback);
        }
    });
};

/**
 * コメントを取得する.
 * 
 * @method getComment
 * @author niikawa
 * @param {Object} id taskmodel._id
 * @param {Function} callback
 */
taskModel.prototype.getComment = function(id, callback) {
    
    var Task = this.db.model(collection);
    Task.findOne({_id: id}).sort({'created': 1}).exec(callback);
};

/**
 * コメントを追加する.
 * 
 * @method addComment
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data
 * @param {Function} callback
 */
taskModel.prototype.addComment = function(id, data, callback) {
    
    var task = this.db.model(collection);
    task.findOne({_id: data._id}, function(err, item)
    {
        if (err || item === null)
        {
            callback();
        }
        else
        {
            item.updateBy = id;
            item.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            var comment = {userId: id, comment: data.comments, date: moment().format('YYYY-MM-DD HH:mm:ss')};
            item.comments.push(comment);
            item.save(callback);
        }
    });
};

module.exports = taskModel;