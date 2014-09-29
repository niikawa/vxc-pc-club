var authServices = angular.module("AuthServices", ["ngResource", "ngCookies"]);
authServices.factory("Auth", ['$resource', '$http', '$window', '$cookies','Utility',
    function($resource, $http, $window, $cookies, Utility) {
        
        //他の認証方式を実装するときのために残しておく
        var getResource = function(){
            
            return $resource('api/auth');
        };
        var login = function(data) {
            
            $http.post('api/login', {mailAddress: data.mailAddress, password: data.password
            }).success(function(data) {
                
                if (data.remember) {
                    //クッキーに入れる
                    console.log('cookies');
                    $cookies.remembertkn = data.remembertkn;
                }
                $window.location.href = "https://"+location.host;

            }).error(function(data) {
                
                Utility.errorSticky(data);
            });
        };
        
        var isLogin = function() {
            
            $http.post('api/isLogin', {}
            ).success(function(data) {
                
                return true;
                
            }).error(function(data) {
                
                $window.location.href = "https://"+location.host;
            });
            
        };
        
        return {
                getResource: getResource,
                login: login,
                isLogin: isLogin,
            };
    }
]);

//自動ログイン機能を追加時に正式に実装する
authServices.factory("AutoAuth", ['$window', '$http', '$q',
    function($window, $http, $q) {
        var deferred = $q.defer();
        //クッキーからトークンを取得
        $http.post('api/auth', {}
        ).success(function(data){
            
            return deferred.promise;
            
        }).error(function(data) {
            $window.location.href = "https://"+location.host;
        });
    }
]);