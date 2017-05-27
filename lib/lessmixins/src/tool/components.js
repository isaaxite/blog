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