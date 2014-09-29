/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',['UesrServices', 'CardServices', 'ModalService']);
mainCtrl.controller('MainCtrl',['$scope', 'User', 'Card', 'Modal', 'Main',function ($scope, User, Card, Modal, Main)
{
    //rate用max
    $scope.max = 5;

    $scope.list2 = [];

    //ユーザーリスト
    $scope.userList = [];
    //タスクの内容
    $scope.content = {};

    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
      User.getMine().then(function(response)
      {
        $scope.userList = response.data.itemList;
      });
    };
    
    /**
     * 詳細登録画面をポップアップさせる
     * @author niikawa
     * @param {Number} index 選択したユーザーを特定するインデックス
     */
    $scope.popupDetails = function(index)
    {
      $scope.modalParam = 
      {
          header: 'タスクを追加します', 
          contents: '',
          progress: 0,
          userId: null,
          status: 1,
          comments: '',
          max: 10,
          isCollapsed: false,
          index: index,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/task.html");
    };
    
    /**
     * 詳細更新画面をポップアップさせる
     * @author niikawa
     * @param {Number} index 選択したユーザーを特定するインデックス
     * @param {Number} child 選択したタスクを特定するインデックス
     */
    $scope.popupDetailsUpdate = function(parent, child)
    {
      
      var parameter = 
      {
        _id: Main.getTaskIdFromList($scope.userList, parent, child)
      };
      
      Card.getComment(parameter).then(function(response)
      {
        var task = $scope.userList[parent].taskList[child];
        $scope.modalParam = 
        {
            header: 'タスクを変更します', 
            max: 10,
            isCollapsed: false,
            newComment: Main.getContentsFromList($scope.userList, parent, child),
            commentList: response.data.itemList,
            progress: Main.getProgressFromList($scope.userList, parent, child),
            _id: parameter._id,
            userId: null,
            parent: parent, 
            child: child,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/taskUpdate.html");
      });
    };

    /**
     * タスクの詳細情報を登録/更新する
     * @author niikawa
     */
    $scope.makeDetails = function()
    {
      var data = $scope.modalParam;
      var parameter = 
      {
        userId: Main.getUserIdFromList($scope.userList, data.index),
        contents: data.contents,
        comments: data.comments,
        progress: data.progress,
      };
      
      $scope.modalInstance.close();
      Card.addCard(parameter).then(function(response)
      {
        $scope.userList[data.index].taskList.push(response.data.item);
      });
    };
    
    /**
     * タスクを追加する
     * @author niikawa
     * @param {Number} index 選択したユーザーを特定するインデックス
     */
    $scope.addCard = function(index)
    {
      var parameter = 
      {
        userId: Main.getUserIdFromList($scope.userList, index),
        contents: $scope.userList[index].my.contents
      };
        
      Card.addCard(parameter).then(function(response)
      {
        $scope.userList[index].my.contents = '';
        $scope.userList[index].taskList.push(response.data.item);
      });
    };
    
    /**
     * 進捗を変更する
     * @author niikawa
     * @param {Number} parent 選択したユーザーを特定するインデックス
     * @param {Number} child 選択したタスクを特定するインデックス
     * @param {Number} progress 選択したタスクを特定するインデックス
     */
    $scope.changeProgress = function(parent, child, progress)
    {
      if ('' === progress)
      {
        progress = $scope.userList[parent].taskList[child].progress;
      }

      var parameter = 
      {
        _id: Main.getTaskIdFromList($scope.userList, parent, child),
        progress: progress,
      };
      Card.changeProgress(parameter).then(function(response)
      {
        $scope.userList[parent].taskList[child].progress = progress;
      });
    };

    /**
     * タスクを削除する
     * @author niikawa
     * @param {Number} parent 選択したユーザーを特定するインデックス
     * @param {Number} child 選択したタスクを特定するインデックス
     */
    $scope.removeCard = function(parent, child)
    {
      var parameter = 
      {
        _id: Main.getTaskIdFromList($scope.userList, parent, child),
      };
      Card.removeCard(parameter).then(function(response)
      {
        $scope.userList[parent].taskList.splice(child, 1);
      });
    };

    $scope.chageStatus = function()
    {
      
    };
    
    /**
     * 該当タスクのコメント一覧を取得してモーダル画面をポップアップさせる
     * @author niikawa
     * @param {Number} parent 選択したユーザーを特定するインデックス
     * @param {Number} child 選択したタスクを特定するインデックス
     */
    $scope.getComment = function(parent, child)
    {
      var parameter = 
      {
        _id: Main.getTaskIdFromList($scope.userList, parent, child),
      };
      
      Card.getComment(parameter).then(function(response)
      {
        $scope.modalParam = 
        {
            header: 'コメント一覧', 
            newComment: '',
            commentList: response.data.itemList,
            data: parameter,
            _id: $scope.userList[parent].taskList[child]._id,
            parent: parent, 
            child: child,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/commentList.html");
      });
    };

    $scope.addComment = function(parent, child)
    {
      $scope.modalParam = 
      {
          header: 'コメント', 
          newComment: '',
          _id: Main.getTaskIdFromList($scope.userList, parent, child),
          parent: parent, 
          child: child,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/comment.html");
    };
    
    $scope.make = function()
    {
      console.log($scope.modalParam);
      $scope.modalInstance.close();
      var parameter = 
      {
        _id: $scope.modalParam._id,
        comments: $scope.modalParam.newComment,
      };
      Card.addComment(parameter).then(function(response)
      {
        $scope.userList[$scope.modalParam.parent].taskList[$scope.modalParam.child].comments.push($scope.modalParam.newComment);
        //socket.io
      });
    };
    
}]);
