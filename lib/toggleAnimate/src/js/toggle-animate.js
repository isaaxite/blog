function setDuration(delay){
	$(this).css({
		'-webkit-animation-duration': delay,
  	'animation-duration': delay
	});
}

$.fn.addAnimation = function(animateClass, callback){
	var $this = $(this);
	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
		animateClass = 'animated ' + animateClass;
	$this.addClass(animateClass).one(animationEnd, function(){
		$this.removeClass(animateClass);
		callback && callback.call(this);
	});
};

$.fn.toggleAnimate = function(sender){

	var that = this,
			$this = $(that);
	var DEFAULT = {
		delay: 0,
		enterDelay: 0,
		leaveDelay: 0,
		enterClass: '',
		leaveClass: '',
		enterCallback: null,
		toggleCallback: null,
		leaveCallback: null
	};

	sender = $.extend({}, DEFAULT, sender);
	sender.enterClass !== '' 
	? (function(){
		// console.log(that);return ;
		sender.enterDelay && setDuration.call(that, sender.enterDelay);
		sender.enterCallback && sender.enterCallback.apply(that, arguments);
		$this.addAnimation(sender.enterClass, function(){

			sender.toggleCallback && sender.toggleCallback.call(this);

			sender.leaveClass ? (function(){
				sender.leaveDelay && setDuration.call(that, sender.leaveDelay);
				$this.addAnimation(sender.leaveClass, function(){
					sender.leaveCallback && sender.leaveCallback.call(this);
				});
			})() : 
			console.log('Whitout LeaveClass');
		});
	})() : 
	console.log('Without Animated');
};