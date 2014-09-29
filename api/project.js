var async = require('async');
var projectModel = require('../model/projectModel');
var project = new projectModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

/**
 * すべてのプロジェクトを作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getProjectAll = function(req, res) {
    
    project.getAll(function(err, itemList){
        
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
 * プロジェクトを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createProject = function(req, res) {
    
    project.isSameName(null, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:err, itemList:itemList});

        } else {

            var message = '';
            project.save(req.session._id, req.body, function(err, item) {
                
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
 * プロジェクトを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateProject = function(req, res) {
    
    project.isSameName(req.body._id, req.body.name, function(isSame, err, itemList) {
        
        var execute = true;
        if (isSame) {
        
            res.json({status: !execute, message: err, itemList: itemList});

        } else {
            
            project.update(req.session._id, req.body, function(err, item) {
                
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
 * プロジェクトを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteProject = function(req, res) {

    project.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};

/**
 *自分の属するプロジェクトを取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.myProject = function(req, res) {

        res.json({status: true});
};

