var async = require('async');
var rankModel = require('../model/rankModel');
var rank = new rankModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

/**
 * すべてのランクを作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getRankAll = function(req, res) {
    
    rank.getAll(function(err, itemList){
        
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
 * ランクを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createRank = function(req, res) {
    
    rank.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:err, itemList:itemList});

        } else {

            var message = '';
            rank.save(req.session._id, req.body, function(err, item) {
                
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
 * ランクを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateRank = function(req, res) {
    
    rank.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
        
            res.json({status: !execute, message: err, itemList: itemList});

        } else {
            
            rank.update(req.session._id, req.body, function(err, item) {
                
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
 * ランクを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteRank = function(req, res) {

    rank.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};