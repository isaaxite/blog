// 切换Animate.css的Animate
$.fn.toggleAnimate = function(sender){
	var DEFAULT = {
		enterClassCallBack: null,	// 动画完成后删除的class
		enterClass: '',		// 进入animate
		leaveClass: null,		// 退出animate
		delay: 300,
		callback: null, 
	};
	sender = $.extend({}, DEFAULT, sender);

	var $this = $(this),
			animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
			enterClass = "animated " + sender.enterClass,
			leaveClass = "animated " + sender.leaveClass;

	!function(){
  	$this.addClass(enterClass).one(animationEnd, function() {
  			var isExist = $this.hasClass(enterClass);
        isExist && $this.removeClass(enterClass);
        // 待优化
        sender.enterClassCallBack && sender.enterClassCallBack.call(this);
    });

		sender.leaveClass ? setTimeout(function(){
			$this.removeClass(enterClass).addClass(leaveClass).one(animationEnd, function() {
          $this.removeClass(leaveClass);
      });
      sender.callback && sender.callback.apply(this, arguments);  
  	}, sender.delay) 
  	: sender.callback && sender.callback.apply(this, arguments);  
	}();

	return $this;	
};