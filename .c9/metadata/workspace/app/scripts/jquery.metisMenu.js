{"filter":false,"title":"jquery.metisMenu.js","tooltip":"/app/scripts/jquery.metisMenu.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":0,"column":0},"end":{"row":0,"column":45}},"text":";(function ($, window, document, undefined) {"},{"action":"insertText","range":{"start":{"row":0,"column":45},"end":{"row":1,"column":0}},"text":"\n"},{"action":"insertLines","range":{"start":{"row":1,"column":0},"end":{"row":45,"column":0}},"lines":["","    var pluginName = \"metisMenu\",","        defaults = {","            toggle: true","        };","        ","    function Plugin(element, options) {","        this.element = element;","        this.settings = $.extend({}, defaults, options);","        this._defaults = defaults;","        this._name = pluginName;","        this.init();","    }","","    Plugin.prototype = {","        init: function () {","","            var $this = $(this.element),","                $toggle = this.settings.toggle;","","            $this.find('li.active').has('ul').children('ul').addClass('collapse in');","            $this.find('li').not('.active').has('ul').children('ul').addClass('collapse');","","            $this.find('li').has('ul').children('a').on('click', function (e) {","                e.preventDefault();","","                $(this).parent('li').toggleClass('active').children('ul').collapse('toggle');","","                if ($toggle) {","                    $(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');","                }","            });","        }","    };","","    $.fn[ pluginName ] = function (options) {","        return this.each(function () {","            if (!$.data(this, \"plugin_\" + pluginName)) {","                $.data(this, \"plugin_\" + pluginName, new Plugin(this, options));","            }","        });","    };","","})(jQuery, window, document);"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":36,"column":45},"end":{"row":36,"column":45},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":52,"mode":"ace/mode/javascript"}},"timestamp":1407747741234,"hash":"9b5bdb2de12288f5a14de928945296f4634209ca"}