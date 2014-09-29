var async = require('async');
var organizationModel = require('../model/organizationModel');
var organization = new organizationModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

//------------------------------------------------------------------------------
// organization
//------------------------------------------------------------------------------
/**
 * すべての組織を作成日の昇順で取得する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getOrganizationAll = function(req, res) {

    organization.getAll(function(err, itemList) {
        
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
 * 組織を作成する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.createOrganization = function(req, res) {
    
    organization.isSameName(null, req.body.name, function(isSame, message, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:message, itemList:itemList});
            
        } else {
            
            organization.save(req.session._id, req.body, function(err, item) {
                
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }

                res.json({status: execute, messages:err, item:item});
            });
        }
    });
};

/**
 * 組織を更新する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.updateOrganization = function(req, res) {
    
    organization.isSameName(req.body._id, req.body.name, function(isSame, message, itemList) {
        
        var execute = true;
        if (isSame) {
            
            res.json({status: !execute, messages:message, itemList:itemList});
            
        } else {
            
            organization.update(req.session._id, req.body, function(err, item) {
                
                if (err) {
                    logger.appError(err);
                    message = messages.COM_ERR_002;
                    execute = false;
                }

                res.json({status: execute, messages:err, item:item});
            });
        }
    });
};

/**
 * 組織を削除する
 * 
 * @author niikawa
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.deleteOrganization = function(req, res) {

    organization.remove(req.query._id, function(err) {
        
        var execute = true;
        if (err) {
            logger.appError(err);
            execute = false;
        }
        res.json({status: execute});
    });
};

//------------------------------------------------------------------------------
// organization line
//------------------------------------------------------------------------------
