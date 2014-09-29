var async = require('async');
var tagModel = require('../model/tagModel');
var tag = new tagModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

/**
 * すべての役職を作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getTagAll = function(req, res) {
    
    tag.getAll(function(err, itemList){
        
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
 * 役職を作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createTag = function(req, res) {
    
    tag.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:err, itemList:itemList});

        } else {

            var message = '';
            tag.save(req.session._id, req.body, function(err, item) {
                
                var execute = true;
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }
                res.json({status: execute, message:message, item: item});
            });
        }
    });
};

/**
 * タグを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateTag = function(req, res) {
    
    tag.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
        
            res.json({status: !execute, message: err, itemList: itemList});

        } else {
            
            tag.update(req.session._id, req.body, function(err, item) {
                
                var message = '';
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_003;
                    execute = false;
                }
                res.json({status: execute, message:message, item:item});
            });
        }
    });
};


/**
 * 役職を削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteTag = function(req, res) {

    tag.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};