/**
 * 下拉菜单组件
 *
 **/
window.Dropmenu = function(){
	var $dropmenu = {
		parent: null,
		options: null,
		input: null
	};
	$.fn.show = function(callback){
		var $this = $(this);
		$dropmenu.parent = $this.closest('.gb-selector');
		$dropmenu.options = $dropmenu.parent.find('.options');
		$dropmenu.input = $dropmenu.parent.find('.input>input');
		var $item = $dropmenu.options.find('li');
		var height = $item.eq(0).height() * $item.length;
		$dropmenu.options.css('height', height);
		callback && callback.call(this);
	};
	$.fn.hide = function(callback){
		var $this = $(this);
		var isSelector = $this.is('.gb-selector');
		isSelector ? function(){
			$this.find('.options').css('height', 0);
		}() : 
		function(){
			$dropmenu.parent = $this.closest('.gb-selector');
			$dropmenu.options = $dropmenu.parent.find('.options');
			$dropmenu.input = $dropmenu.parent.find('.input>input');
			$dropmenu.options.css('height', 0);
		}();
		callback && (isSelector ? callback.call(this) : callback());
	};
	$(document)
	.on('click', function(){
		$('.gb-selector').hide();
	});

	$(document.body)
	.on('click', '.gb-selector', function(e){ e.stopPropagation(); })
	.on('click', '.gb-selector>.input', function(){
		$(this).show();
	})
	.on('click', '.gb-selector>.options>li', function(){
		var val = $(this).text();
		var isTitle = $(this).hasClass('title');
		isTitle || $(this).hide(function(){
			$dropmenu.input.val(val);
		});
	});
};


/**
 * 路由
 *
 **/
function Router(options) {
	var params = function(){
		if(location.href.indexOf('#') < 0){ 
			return { hash: '#', urlParams: {}, hashParams: {} }; 
		}
		var temp = location.href.split('#');
		var url = temp[0], hash = '#'+temp[1];
		var hash, urlParams = {}, hashParams = {};

		if(url.indexOf('?') > -1){
			var urlStr = url.split('?')[1];
			if(urlStr.indexOf('/') > -1){
				urlStr = urlStr.slice(0, -1);
			}
			var urlArr = urlStr.split('&');
			for(index in urlArr){
				temp = urlArr[index].split('=');
				urlParams[temp[0]] = decodeURIComponent(temp[1]);
			}
		}

		if(hash.indexOf('?') > -1){
			temp = hash.split('?');
			hash = temp[0];
			var hashArr = temp[1].split('&');
			for( index in hashArr ) {
				temp = hashArr[index].split('=');
				hashParams[temp[0]] = decodeURIComponent(temp[1]);
			}
		}
		return { hash: hash, urlParams: urlParams, hashParams: hashParams }
	};

	var routes = function() {
		var search = params();
		options[search.hash](search);
	};
	window.addEventListener('load', routes);
	window.addEventListener('hashchange', routes);
}

/**
 * Form表单检测组件
 *
 **/
!function(){

	window.FromChecker = function(options) {

		var DEFAULT = {
			el: 'form',
			noCheckNames: [],
			toast: function(tip) { alert(tip); },
			tipAttrName: 'data-tip' 
		};

		if(typeof options != 'object'){ console.error('Please Init With Object');return ; }
		this.formData = null;
		this.options = $.extend({}, DEFAULT, options);
		this.tip = "请输入完成信息!";

	};

	FromChecker.prototype.RegExps = {
		username: /^[a-z0-9_-]{3,16}$/,
		pwd: /^[a-z0-9_-]{6,18}$/,
		url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
		number: /\d/,
		email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
	};

	FromChecker.prototype.isInArray = function(item, array) {
		var arrStr = array.join(',');
		item = item + '';
		return arrStr.indexOf(item) > -1 ? true : false;
	};

	FromChecker.prototype.getTip = function(itemName) {
		var options = this.options;
		var $item = $('[name='+ itemName +']');
		var tip = $item.attr(options.tipAttrName) || $item.parent().attr(options.tipAttrName) || this.tip;
		return tip;
	};

	FromChecker.prototype.check = function(callback) {
		var options = this.options;
		this.formData = $(options.el).serializeArray();
		var $item, that = this;
		var res = { status: true };

		$.each(this.formData, function checkEachItem(i, v) {
			var isCheck = !that.isInArray(v.name, options.noCheckNames);
			if( isCheck ) {
				if( v.value.trim() === '' ) { 
					var tip = that.getTip(v.name);
					options.toast(tip);
					res = { status: false, name: v.name };
					return false;
				}
			}
		});
		if(callback){
			if(!callback()){ res.status = false; }
		}
		return res;
	};

	FromChecker.prototype.ajaxSubmit = function(sender) {
		var that = this;
		var options = that.options;
		var DEFAULT = {
			url: $(options.el).prop('action'),
			method: 'post',
			dataType: 'json',
			data: that.formData
		};
		sender = $.extend({}, DEFAULT, sender)
		if(!sender.url) { 
			console.error('Error: Action can not be empty!'); 
			return ;
		}

		$.ajax({
			url: sender.url,
			method: sender.method,
			data: sender.data,
			dataType: sender.dataType,
			cache: false,
			async: true,
			success: function(resp){
				var obj = $(options.el)[0];
				sender.success && sender.success.call(obj, resp);
			},
			error: function(resp){
				console.error('Error: Can not to Connect: ', sender.url);
				console.error(resp);
			}
		});
	};

}();
+function fnExtend(){
	$.fn.radio = function(sender) {
		var DEFAULT = {
			itemEle: '.item',
			activeClass: 'active'
		};
		if($.isFunction(sender)) {
			sender = { callback: sender };
		}else if($.isPlainObject(sender)){
			console.error("Error: Please init with object or function");
			return false;
		}else{
			console.error('Error: unknown');
			return false;
		}

	  sender = $.extend({}, DEFAULT, sender);

	  $(document).on('click', $(this).selector, function(){
	    var $this = $(this);
	    var $parent = sender.parent 
	        ? $this.closest(sender.parent) 
	        : $this.closest(sender.itemEle).parent();
	    var $activeEle = $this.closest(sender.itemEle) || $this;

	    $parent.find(sender.itemEle).removeClass(sender.activeClass);
	    $activeEle.addClass(sender.activeClass);
	    sender.callback && sender.callback.apply(this);
	  });
	  return $(this);
	};

	$.fn.checkbox = function(options) {
		var DEFAULT = {
			itemEle: '.item',
			activeClass: 'active',
		};

		if($.isFunction(options)) {
			options = { callback: sender };
		}else if($.isPlainObject(options)){
			console.error("Error: Please init with object or function");
			return false;
		}else{

		}

		options = $.extend({}, DEFAULT, options);

		$(document).on('click', $(this).selector, function(){
      var $this = $(this);
	    var $parent = options.parent 
	        ? $this.closest(options.parent) 
	        : $this.closest(options.itemEle).parent();
	    var $activeEle = $this.closest(options.itemEle) || $this;

      var isActive = $activeEle.hasClass(options.activeClass);

      isActive 
      ? $activeEle.removeClass(options.activeClass) 
      : $activeEle.addClass(options.activeClass);
      
      options.callback && options.callback.call(this, isActive);
    });
	}
}();