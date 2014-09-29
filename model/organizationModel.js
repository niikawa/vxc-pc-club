var Core = require('./coreModel.js');
var mongoose = require('mongoose');
var moment = require('moment');
/**
 * organization modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "organizations"
 */
var collection = 'organizations';

/**
 * organization Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class organizationModel
 * @constructor
 * @extends Core
 */
var organizationModel = function organizationModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(organizationModel, Core);

/**
 * 組織を保持するコレクション.
 * 
 * @property organizationsSchema
 * @type {Object}
 */
var organizationsSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: {type: String},
  level: {type: Number, default: 0}//0は階層に属さない
});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, organizationsSchema);

/**
 * 組織を登録する.
 * 
 * @method save
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data data.name
 * @param {Function} callback
 */
organizationModel.prototype.save = function(id, data, callback) {
    
    var Org = new myModel(data);
    Org.creatBy = id;
    Org.updateBy = id;
    Org.save(callback);
};

/**
 * 組織を更新する.
 * 
 * @method update
 * @author niikawa
 * @param {Object} id userId
 * @param {Object} data data.name
 * @param {Function} callback
 */
organizationModel.prototype.update = function(id, data, callback) {
    
    var Org = this.db.model(collection);
    Org.findOne({_id:data._id},function(err, target){
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


module.exports = organizationModel;