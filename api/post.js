var async = require('async');
var postModel = require('../model/postModel');
var post = new postModel();
//var roleModel = require('../model/roleModel');
//var role = new roleModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

//------------------------------------------------------------------------------
// Post
//------------------------------------------------------------------------------
/**
 * すべての役職を作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getPostAll = function(req, res) {
    
    post.getAll(function(err, itemList){
        
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
exports.createPost = function(req, res) {
    
    post.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:err, itemList:itemList});

        } else {

            var message = '';
            post.save(req.session._id, req.body, function(err, item) {
                
                var execute = true;
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
 * 役職を更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updatePost = function(req, res) {
    
    post.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
        
            res.json({status: !execute, message: err, itemList: itemList});

        } else {
            
            post.update(req.session._id, req.body, function(err, item) {
                
                var message = '';
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_003;
                    execute = false;
                }
                res.json({status: execute, message:message, item: item});
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
exports.deletePost = function(req, res) {

    post.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};


//
// role
//

//
// auth
//
