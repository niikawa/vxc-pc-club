var crypto = require('crypto');
var Core = require('./coreModel');
var mongoose = require('mongoose');
var moment = require('moment');

/**
 * user modelで使用するコレクション名.
 * 
 * @property collection
 * @type {String}
 * @default "users"
 */
var collection = 'users';

/**
 * User Model Class.
 *
 * @author niikawa
 * @namespace model
 * @class userModel
 * @constructor
 * @extends Core
 */
var userModel = function userModel() {
    
    Core.call(this, collection);
};

//coreModelを継承する
var util = require('util');
util.inherits(userModel, Core);

/**
 * ユーザーを保持するコレクション.
 * 
 * @property userSchema
 * @type {Object}
 */
var usersSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now},
  creatBy: {type: String},
  updateBy: {type: String},
  employeeNumber:{type: Number},
  employeeType:{type: Number}, //1:社員2:契約社員3:アルバイト,9:退職者
  organizations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'organizations' }],
  posts:[{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }],
  ranks:{ type: mongoose.Schema.Types.ObjectId, ref: 'ranks' },
  userImagePath:{type: String},
  firstName: {type: String},
  lastName: {type: String},
  firstNameKana: {type: String},
  lastNameKana: {type: String},
  mailAddress: {type: String},
  password: String,
  birth: {type: String},
  age: {type: Number},
  sex: {type: Number},
  telNo: {type: String},
  zip: {type: String},
  prefectures: {type: String},
  city: {type: String},
  address: {type: String},
  entryDate: {type: Date, default: Date.now},
  leavingDate: {type: Date},
  keywords: {type: String},
  tags:[{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' , default: null}],
//  teams:[{ type: mongoose.Schema.Types.ObjectId, ref: 'teams', default: null }],
  skills: {type: Object},
  remembertkn:{type: String},
  autoLoginId:{type: String},
  
  //後で追加する
  //
  //role

});

// モデル化。model('モデル名', '定義したスキーマクラス')
var myModel = mongoose.model(collection, usersSchema);

// middleware
// save処理の前にフックをかけれる。RailsでいうFilterみたいな機能
usersSchema.pre('save', function (next) {
    
    next();
});

/**
 * ログイン
 * 
 * @method login
 * @author niikawa
 * @param {String} mailAddress
 * @param {String} password
 * @param {Function} callback
 */
userModel.prototype.login = function(mailAddress, password, callback) {
    
    var User = this.db.model(collection);
    var pw = crypto.createHash('md5').update(password).digest("hex");
    
    User.find( {$and: [{mailAddress: mailAddress}, {password: pw}] }, callback);
};

/**
 * ユーザーを取得する(ページング用)
 * 
 * @method getUser
 * @author niikawa
 * @param {Number} skip
 * @param {Number} limit
 * @param {Object} conditon
 * @param {Funtion} callback
 */
userModel.prototype.getUser = function(skip, limit, condition, callback) {
    
    var User = this.db.model(collection);
    User.find().sort({'created': 1}).populate('organizations').populate('posts').skip(skip).limit(limit).exec(callback);
    
//    Chat.find({ "users._id" : { $in:[id] } },null, {sort:{'created': 1}},callback).populate('messages', null, null, { sort: { 'created': 1 } });
    
    
};

/**
 * IDに合致したユーザーを取得する
 * 
 * @method getById
 * @author niikawa
 * @param {String} id
 * @param {Funtion} callback
 */
userModel.prototype.getById = function(id, callback) {
    
    var User = this.db.model(collection);
    User.findOne({_id: id}).populate('organizations').populate('posts').populate('ranks').populate('tags').exec(callback);
};


/**
 * キーワードを含むユーザーを取得する.
 * 
 * @method searchByKeywords
 * @author niikawa
 * @param {String} query
 * @param {Funtion} callback
 */
userModel.prototype.searchByKeywords = function(query, callback) {
    
    var User = this.db.model(collection);
    
    var qList = query.split(' ');
    var qNum = qList.length;
    var q = {};
    if (qNum > 1) {
        
        q = {$and: []};
        for (var index=0; index < qNum; index++) {
            
            if ('' !== qList[index]) {
                
                q.$and.push({keywords: new RegExp(qList[index], 'i')});
            }
        }

    } else {
        
        q = {keywords: new RegExp(query, 'i')};
    }
    User.find(q).sort({'created': 1}).populate('organizations').populate('posts').populate('ranks').exec(callback);
};


/**
 * 条件に一致するユーザーを取得する.
 * 
 * @method getUserByCondition
 * @author niikawa
 * @param {Object} condition
 * @param {Number} skip
 * @param {Number} limit
 * @param {Funtion} callback
 */
userModel.prototype.getUserByCondition = function(condition, skip, limit, callback) {
    
};

/**
 * 同一の社員番号またはメールアドレスを持つユーザーが存在するかチェックする
 * 
 * @method isSameUser
 * @author niikawa
 * @param {String} id ユーザーiD
 * @param {Object} data
 * @param {Funtion} callback
 */
userModel.prototype.isSameUser = function(data, callback) {
    
    var query = { $or:[{'employeeNumber': data.employeeNumber} , {'mailAddress': data.mailAddress} ]};
    if (null !== data.id) query.$and = [{_id : { $ne : data.id} }];
    var User = this.db.model(collection);
    User.findOne(query, function(err, item){
        
        var result = {isSame:false, type: 0};
        console.log(item);
        if (item !== null && item !== void 0) {
            result.isSame = true;
            result.type = (item.employeeNumber === data.employeeNumber) ? 1 : 2;
        }
        callback(result);
    });
};

/**
 * ユーザーを作成する
 * 
 * @method save
 * @author niikawa
 * @param {String} id ユーザーiD
 * @param {Object} data
 * @param {Funtion} callback
 */
userModel.prototype.save = function(id, data, callback) {
    
    var User = new myModel(data);
    
    User.creatBy = id;
    User.updateBy = id;
    User.password = crypto.createHash('md5').update(data.password).digest("hex");
    User.birth = data.birthYear + '-' + data.birthMonth + '-' + data.birthDay;
    User.telNo = data.telFront + '-' + data.telCenter + '-' + data.telBack;
    User.zip = data.zipFront + '-' + data.zipBack;
    
    //かなを全角文字に変換しないとダメ
    
    //キーワードを生成
    User.keywords = 
        data.lastName
        +data.firstName
        +data.lastNameKana
        +data.firstNameKana
        +data.mailAddress
        +data.employeeNumber
        ;
    
    User.save(callback);
};

/**
 * マスタ画面からユーザーを更新する
 * 
 * @method update
 * @author niikawa
 * @param {object} data data.userid + collection member
 * @param {Funtion} callback
 */
userModel.prototype.update = function(id, data, callback) {
    
    var User = this.db.model(collection);
    User.findOne({_id:data.id},function(err, target) {
        
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            //呼び出し元画面から更新されない項目
            data.tags = target.tags;
            data.remembertkn = target.remembertkn;
            data.autoLoginId = target.autoLoginId;
            
            target.updateBy = data.id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.employeeNumber = data.employeeNumber;
            target.employeeType = data.employeeType;
            target.organizations = data.organizations;
            target.posts = data.posts;
            target.ranks = data.ranks;
            target.userImagePath = data.userImagePath;
            target.firstName = data.firstName;
            target.lastName = data.lastName;
            target.firstNameKana = data.firstNameKana;
            target.lastNameKana = data.lastNameKana;
            target.mailAddress = data.mailAddress;
            target.password = crypto.createHash('md5').update(data.password).digest("hex");
            target.birth = data.birthYear + '-' + data.birthMonth + '-' + data.birthDay;
            target.age = data.age;
            target.sex = data.sex;
            target.telNo = data.telFront + '-' + data.telCenter + '-' + data.telBack;
            target.zip = data.zipFront + '-' + data.zipBack;
            target.prefectures = data.prefectures;
            target.city = data.city;
            target.address = data.address;
            target.entryDate = data.entryDate;
            target.LeavingDate = data.LeavingDate;
            target.tags = data.tags;
            //かなを全角文字に変換しないとダメ
            //キーワードを生成
            target.keywords = 
                data.lastName
                +data.firstName
                +data.lastNameKana
                +data.firstNameKana
                +data.mailAddress
                +data.employeeNumber
                ;
            target.save(callback);
        }
    });
};

userModel.prototype.updateMine = function(id, data, callback) {

    var User = this.db.model(collection);
    User.findOne({_id:id},function(err, target) {
        
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.userImagePath = data.userImagePath;
            target.firstName = data.firstName;
            target.lastName = data.lastName;
            target.firstNameKana = data.firstNameKana;
            target.lastNameKana = data.lastNameKana;
            target.mailAddress = data.mailAddress;
            //パスワードは入力されている場合にのみ設定
            if (data.password.trim().length !== 0)
            {
                target.password = crypto.createHash('md5').update(data.password).digest("hex");
            }
            target.birth = data.birthYear + '-' + data.birthMonth + '-' + data.birthDay;
            target.age = data.age;
            target.sex = data.sex;
            target.telNo = data.telFront + '-' + data.telCenter + '-' + data.telBack;
            target.zip = data.zipFront + '-' + data.zipBack;
            target.prefectures = data.prefectures;
            target.city = data.city;
            target.address = data.address;
            target.tags = data.tags;
            //キーワードを生成
            target.keywords = 
                data.lastName
                +data.firstName
                +data.lastNameKana
                +data.firstNameKana
                +data.mailAddress
                +data.employeeNumber
                +data.skillNameList.join('');
            
            target.save(callback);
            
        }
    });
};

/**
 * ユーザーのスキルを設定する
 * 
 * @method setSkill
 * @author niikawa
 * @param {Object} data data.userId data.employeeType
 * @param {Funtion} callback
 */
userModel.prototype.setSkill = function(id, data, callback) {
    
    var targetId = (data._id === void 0) ? id : data._id;
    var User = this.db.model(collection);
    User.findOne({_id: targetId},function(err, target) {
        
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            target.updateBy = id;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.skills = data.skill;
            //キーワードに追加する
            target.keywords = target.keywords+data.skillNameList.join('');
            target.save(callback);
        }
    });
};

/**
 * パスワードが一致するか判定する
 * 
 * @method passwordMatch
 * @author niikawa
 * @param {String} id
 * @param {String} password
 * @param {Funtion} callback
 */
userModel.prototype.passwordMatch = function(id, password, callback) {
    
    var p = crypto.createHash('md5').update(password).digest("hex");
    var User = this.db.model(collection);
    User.findOne( {$and: [{_id: id}, {password: p}] } , function(err, item) {
        callback(null === item);
    });
};

/**
 * パスワードを変更する
 * 
 * @method updatePassword
 * @author niikawa
 * @param {Object} data data.updatedId data.targetId data.password
 * @param {Funtion} callback
 */
userModel.prototype.updatePassword = function(data, callback) {
    
    var User = this.db.model(collection);
    User.findOne({_id:data.targetId},function(err, target){
        
        if(err || target === null) {
            
            callback('対象が見つかりません');
            
        } else {
            
            target.updateBy = data.updatedId;
            target.updated = moment().format('YYYY-MM-DD HH:mm:ss');
            target.password = crypto.createHash('md5').update(data.password).digest("hex");
            target.save(callback);
        }
    });
};

/**
 * 自動ログイン
 * 
 * @method autoLogin
 * @author niikawa
 * @param {Object} data data.userId data.targetId data.password
 * @param {Funtion} callback
 */
userModel.prototype.autoLogin = function(data, callback) {
    
//    var key = 
    var User = this.db.model(collection);
    
};

/**
 * 自動ログイン用のトークンを更新する
 * 
 * @method updateRememberTkn
 * @author niikawa
 * @oaram {String} tkn
 * @param {Funtion} callback
 */
userModel.prototype.updateRememberTkn = function(tkn, callback) {
    
    
};

/**
 * 自動ログイン用のトークンを生成する
 * 
 * @method generateRememberTkn
 * @author niikawa
 * @return String
 */
function generateRememberTkn() {
    
//    moment
    var tkn;
    
    return tkn;
}


module.exports = userModel;