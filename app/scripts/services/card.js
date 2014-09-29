var cardServices = angular.module("CardServices", ["ngResource"]);
cardServices.factory("Card", ['$http','Utility',
    function($http, Utility) 
    {
        var cardServices = {};
        
        cardServices.addCard = function(parameter)
        {
            var promise = $http.post('api/card', {parameter: parameter}
            ).success(function(data, status, headers, config)
            {
                return data;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        cardServices.removeCard = function(parameter)
        {
            var promise = $http.post('api/card/remove', {parameter: parameter}
            ).success(function(data, status, headers, config)
            {
                return data;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        cardServices.changeProgress = function(parameter)
        {
            var promise = $http.post('api/card/changeProgress', {parameter: parameter}
            ).success(function(data, status, headers, config)
            {
                return data;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        cardServices.getComment = function(parameter)
        {
            var promise = $http.post('api/card/getComment', {parameter: parameter}
            ).success(function(data, status, headers, config)
            {
                return data;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        cardServices.addComment = function(parameter)
        {
            var promise = $http.post('api/card/addComment', {parameter: parameter}
            ).success(function(data, status, headers, config)
            {
                return data;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        return cardServices;
    }
]);
