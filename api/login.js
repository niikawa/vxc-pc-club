var userModel = require('../model/userModel');
var user = new userModel();
var logger = require('../util/logger');
var messages = require('../config/messages.js');

/**
 * ログイン状態かを判定する
 * 
 * @author niikawa
 * @method isLogin
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.isLogin = function(req, res){
    
    if (req.session.isLogin) {
        
        res.status(200).send('Authentication Succsess');
        
    } else {
        
        if (req.body.autoId) {
            
            //自動ログイン
            
            //新しいトークンを生成
        }
        
        res.status(404).send('Authentication Failed');
    }
};

/**
 * リクエストを受け取り、ログインを行う.
 * 
 * @author niikawa
 * @method login
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.login = function(req, res){
    
    user.login(req.body.mailAddress, req.body.password, function(err, itemList) {
        
        var message = '';
        var item = null;
        if (err) {
            
            logger.appError(err);
            message = messages.COM_ERR_006;
        }
        
        if (itemList.length > 1) {
            
            logger.appError(messages.AUT_ERR_001);
            logger.appError(itemList);
            res.status(404).send(messages.AUT_WARN_001);
            
        } else if (itemList.length === 0) {
            
            logger.appError(messages.AUT_ERR_002);
            logger.appError(itemList);
            res.status(404).send(messages.AUT_WARN_001);
            
        } else {
            
            item = itemList[0];
            req.session._id = itemList[0]._id;
            //req.session.name = itemList[0].name;
            //req.session.role = itemList[0].role;
            req.session.isLogin = true;
            res.json({message: message, item: item});
        }
    });
};

/**
 * ログアウトする
 * 
 * @author niikawa
 * @method logout
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.logout = function(req, res){
    
    
};