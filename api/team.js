var async = require('async');
var teamModel = require('../model/teamModel');
var team = new teamModel();
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
exports.getTeamAll = function(req, res) {
    
    
    async.parallel(
        [function (callback) {
            
            team.getAll(callback);
        },
        function (callback) {
            project.getAll(callback);
        }]
        ,function(err, itemLists) {
            
            var execute = true;
            var message = '';
            var resultLists = {teams: [], projects: []};
            if (err) {
                logger.appError(err);
                message = messages.COM_ERR_001;
                execute = false;
                
            } else {
                
                resultLists.teams = itemLists[0];
                resultLists.projects = itemLists[1];
            }
            
            res.json({status: execute, messages: message, itemLists: resultLists});
        }
    );
};

/**
 * チームを作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createTeam = function(req, res) {
    
    team.save(req.session._id, req.body, function(err, item) {
        
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
 * チームをコピーする
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.copyTeam = function(req, res) {
    
    team.copy(req.session._id, req.body, function(err, item) {
        
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
 * チームを更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateTeam = function(req, res) {
    
    team.update(req.session._id, req.body, function(err, item) {
        
        var execute = true;
        var message = '';
        if (err) {
            logger.appError(err);
            message = messages.COM_ERR_003;
            execute = false;
        }
        res.json({status: execute, message:message, item:item});
    });
};

/**
 * チームを削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteTeam = function(req, res) {

    team.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};