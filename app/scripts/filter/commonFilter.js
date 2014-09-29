//------------------------------------------------------
//共通のフィルター群
//
//
//
//------------------------------------------------------//
var myApp = angular.module('myApp');

/**
 * 配列の件数を返却する
 * 配列以外で利用された場合は0を返却する
 * 
 * @author niikawa
 */
myApp.filter('count', function(){
    
    return function(list)
    {
        console.log(list);
        
        if (void 0 !== list || void 0 !== list.length)
        {
            return list.length;
        }
        else
        {
            return 0;
        }
    };
});
