'use strict';

/**
 * @ngdoc overview
 * @name workspaceApp
 * @description
 * # workspaceApp
 *
 * Main module of the application.
 */
angular
  .module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDragDrop',
    'ui.bootstrap',
    'loginCtrl',
    'mainCtrl',
  ])
  .config(function ($routeProvider) {
    
    var autoCheck = function($http, $q, $window, $cookies) {
        
        var deferred = $q.defer();
        
        $http.post('api/isLogin', {remembertkn: $cookies.remembertkn}
        
        ).success(function(data) {
            
            deferred.resolve(true);
            
        }).error(function(data) {
            
            $window.location.href = "https://"+location.host+"/login";
        });

        return deferred.promise;
    };
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {isLogin: autoCheck}
      })
      .otherwise({
        redirectTo: '/'
      });
  });
