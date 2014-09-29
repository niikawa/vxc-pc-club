var myApp = angular.module('myApp');
myApp.directive('myHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/common/header.html'};
    }).directive('mySide', function(){
    return {
        restrict: 'E',
        templateUrl: 'partials/common/side.html'
        };
    });