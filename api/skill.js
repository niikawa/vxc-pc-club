var async = require('async');
var skillCategoryModel = require('../model/skillCategoryModel');
var skillCategory = new skillCategoryModel();
var skillModel = require('../model/skillModel');
var skill = new skillModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

//------------------------------------------------------------------------------
//skill category
//------------------------------------------------------------------------------
/**
 * すべてのスキルカテゴリを作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getCategoryAll = function(req, res) {

    skillCategory.getAll(function(err, itemList) {
        
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_001;
            execute = false;
        }
        res.json({status: execute, messages: message, itemList: itemList});
    });
};

/**
 * スキルカテゴリを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createCategory = function(req, res) {
    
    skillCategory.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:err, itemList:itemList});

        } else {

            skillCategory.save(req.session._id, req.body.name, function(err, item) {
                
                var message = '';
                execute = true;
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }
                res.json({status: execute, message:messages, item: item});
            });
        }
    });
};

/**
 * スキルカテゴリを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteCategory = function(req, res) {
    
    //カテゴリに属するスキルを削除する
    skill.removeByCategoryId(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
            res.json({status: execute});
        }
        
        //カテゴリを削除する
        skillCategory.remove(req.query._id, function(err) {
            
            var execute = true;
            if (err) {
                logger.appError(err);
                execute = false;
            }
            res.json({status: execute});
        });
    });
};

/**
 * スキルカテゴリを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateCategory = function(req, res) {
    
    skillCategory.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages: err, itemList: itemList});

        } else {
            
            skillCategory.update(req.session._id, req.body, function(err) {
                
                var message = '';
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_003;
                    execute = false;
                }
                res.json({status: execute, messages:message});
            });
        }
    });
};

//------------------------------------------------------------------------------
//skill
//------------------------------------------------------------------------------
/**
 * すべてのスキルを作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAllSkill = function(req, res) {
    
    skill.getAll(function(err, itemList) {
        
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_001;
            execute = false;
        }
        res.json({status: execute, messages: message, itemList: itemList});
    });
};

/**
 * カテゴリIDに合致したスキルを取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getByCategoryId = function(req, res) {
    
    skill.getByCategoryId(req.query._id, function(err, itemList){
        
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_001;
            execute = false;
        }
        res.json({status: execute, messages: message, itemList: itemList});
    });
};

/**
 * スキルを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.skillCreate = function(req, res) {
    
    skill.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages: err, itemList: itemList});
            
        } else {
            
            skill.save(req.session._id, req.body.category, req.body.name, function(err, item) {
                
                var message = '';
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }
                res.json({status: execute, messages: message, item: item});
            });
        
        }
    });
};

/**
 * スキルを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.skillDelete = function(req, res) {
    
    skill.remove(req.query._id, function(err){
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};

/**
 * スキルを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.skillUpdate = function(req, res) {
    
    skill.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages: err, itemList: itemList});
            
        } else {
            
            skill.update(req.session._id, req.body, function(err, item) {
                
                var message = '';
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_003;
                    execute = false;
                }
                res.json({status: execute, messages:message, item: item});
            });
        }
    });
};

/**
 * カテゴリと属するスキルを取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getSkillsBeloginToCategory = function(req, res) {
    
    skill.getSkillsBeloginToCategory(function(err, items) {
        
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_001;
            execute = false;
        }
        res.json({status: execute, messages:message, items: items});
    });
};