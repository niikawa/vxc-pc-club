var async = require('async');
var logger = require('../util/logger');
var messages = require('../config/messages.js');
var db = require('mongoose');
var taskModel = require('../model/taskModel');
var task = new taskModel();

exports.getMine = function(req, res)
{
    async.parallel(
        [
            function(callback)
            {
                var User = db.model('users');
                User.findOne({_id:req.session._id}, callback);
            },
            function(callback)
            {
                task.getMine(req.session._id, callback);
            }
        ],
        function(err, items)
        {
            var execute = true;
            var message = '';
            if (err)
            {
                logger.appError(err);
                message = messages.COM_ERR_001;
                execute = false;
            }
            var mine = {my: items[0], taskList: items[1]};
            var itemList = [];
            itemList.push(mine);

            res.json({status: execute, message:message, itemList: itemList});
        }
    );
};

