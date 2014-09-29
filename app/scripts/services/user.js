var uesrServices = angular.module("UesrServices", ["ngResource"]);
uesrServices.factory("User", ['$http','Utility',
    function($http, Utility)
    {
        var userService = {};
        
        //ログインユーザーの情報を取得する
        userService.getMine = function()
        {
            var promise = $http.post('api/mine',{}
            ).success(function(data, status, headers, config)
            {
                return data;

            }).error(function(data)
            {
                 Utility.errorSticky(data);
            });
            return promise;
        };
        

        //ユーザー情報を取得する
        userService.getUser = function (id)
        {
            

        };
        
        userService.getUserList = function ($id)
        {
            
        };
        
        userService.getUserListByTeam = function ($id)
        {
            
        };
        
        //生年月日を生成
        userService.createBirth = function (year, month, day)
        {
            if ('' !== year && '' !== month && '' !== day ) {
                
                return year + '-' + month + '-' + day;
            }
            return '';
        };
        
        //都道府県を取得
        userService.getPrefectures = function()
        {
            return [
                {value:'01', text:'北海道'},{value:'02', text:'青森'}, {value:'03', text:'岩手'},
                {value:'04', text:'宮城'},{value:'05', text:'秋田'}, {value:'06', text:'山形'},
                {value:'07', text:'福島'},{value:'08', text:'茨城'}, {value:'09', text:'栃木'},
                {value:'10', text:'群馬'},{value:'11', text:'埼玉'}, {value:'12', text:'千葉'},
                {value:'13', text:'東京'},{value:'14', text:'神奈川'}, {value:'15', text:'新潟'},
                {value:'16', text:'富山'},{value:'17', text:'石川'}, {value:'18', text:'福井'},
                {value:'19', text:'山梨'},{value:'20', text:'長野'}, {value:'21', text:'岐阜'},
                {value:'22', text:'静岡'},{value:'23', text:'愛知'}, {value:'24', text:'三重'},
                {value:'25', text:'滋賀'},{value:'26', text:'京都'}, {value:'27', text:'大阪'},
                {value:'28', text:'兵庫'},{value:'29', text:'奈良'}, {value:'30', text:'和歌山'},
                {value:'31', text:'鳥取'},{value:'32', text:'島根'}, {value:'33', text:'岡山'},
                {value:'34', text:'広島'},{value:'35', text:'山口'}, {value:'36', text:'徳島'},
                {value:'37', text:'香川'},{value:'38', text:'愛媛'}, {value:'39', text:'高知'},
                {value:'40', text:'福岡'},{value:'41', text:'佐賀'}, {value:'42', text:'長崎'},
                {value:'43', text:'熊本'},{value:'44', text:'大分'}, {value:'45', text:'宮崎'},
                {value:'46', text:'鹿児島'},{value:'47', text:'沖縄'},
            ];
        };
        return userService;        
    }
]);