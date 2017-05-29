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
			return { hash: '#', url_params: {}, hash_params: {} }; 
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
		return { hash: hash, url_params: urlParams, hash_params: hashParams }
	};

	var routes = function() {
		var search = params();
		options[search.hash](search);
	};
	window.addEventListener('load', routes);
	window.addEventListener('hashchange', routes);
}

