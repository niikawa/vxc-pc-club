var async = require('async');
var taskModel = require('../model/taskModel');
var task = new taskModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

/**
 * タスクを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.addTask = function(req, res) 
{
    task.save(req.session._id, req.body.parameter, function(err, item)
    {
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_002;
            execute = false;
        }
        res.json({status: execute, message:message, item: item});
    });
};

/**
 * タスクを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.removeTask = function(req, res) 
{
    task.remove(req.body.parameter._id, function(err, item)
    {
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_002;
            execute = false;
        }
        res.json({status: execute, message:message, item: item});
    });
};

/**
 * 進捗を変更する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.changeProgress = function(req, res) 
{
    task.changeProgress(req.session._id, req.body.parameter, function(err, item)
    {
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_002;
            execute = false;
        }
        res.json({status: execute, message:message, item: item});
    });
};

/**
 * コメントを取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getComment = function(req, res) 
{
    task.getComment(req.body.parameter._id, function(err, item)
    {
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_002;
            execute = false;
        }

        res.json({status: execute, message:message, itemList: item.comments});
    });
};

exports.addComment = function(req, res)
{
    task.addComment(req.session._id, req.body.parameter, function(err, item)
    {
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_002;
            execute = false;
        }
        res.json({status: execute, message:message, item: item});
    });
};

