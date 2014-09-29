/**
 * rateフィルター
 * %で保持している場合にrateDirectiveのvalueを生成するためのフィルター
 * 
 * @param progress 
 * @param max
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.filter('rateFilter', function(){
    
    return function(progress, max)
    {
        if (0 === progress)
        {
            return 0;
        }
        else if (100 === progress)
        {
            return max;
        }
        else
        {
            return (progress / (100 / max)).toFixed(1); 
        }
    };
});
    
