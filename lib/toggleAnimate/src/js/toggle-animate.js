!function(){

	function consoleErr(msg){
		console.error(msg);
		return ;
	}

	function setDuration(delay){
		$(this).css({
			'-webkit-animation-duration': delay,
	  	'animation-duration': delay
		});
	}

	function formatDelay(delay){
		var pattern1 = /\d+s/g,
				pattern2 = /\d+ms/g;
		if(pattern1.test(delay)){
			
			return delay;
		
		}else if(pattern2.test(delay)){
			
			return parseInt(delay)/1000 + 's';

		}else if(!isNaN(delay) && delay !==''){

			return delay < 10 ? delay+'s' : (delay/1000)+'s';
		}else{
			return false;
		}
	}

	function testDelay(options){
		var res, temp;
		if(options.enterDelay !== undefined){
			if(options.enterDelay !== 0){
				temp = formatDelay(options.enterDelay);
				if(temp !== false){
					options.enterDelay = temp;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		if(options.leaveDelay !== undefined){
			if(options.leaveDelay !== 0){
				temp = formatDelay(options.leaveDelay);
				if(temp !== false){
					options.leaveDelay = temp;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		return options;
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

	$.fn.toggleAnimate = function(options){


		options = testDelay(options);
		if(options === false){ return consoleErr('Error: Please Format Delay'); }

		var params = Array.prototype.slice.call(arguments, 1);

		if(!options){ console.error('Without options');return ; }

		if(typeof options === 'function' ){
			var method = options;
			return method.apply(this, params);
		}else if( typeof options === 'object'){
			// console.log(options);return ;

		}else if(typeof options === 'string'){
			var temp = {
				enterClass: options
			};
			if(params.length != 0 && typeof params[0] === 'function'){
				var method = params[0]; 
				params = Array.prototype.slice.call(params, 1);
				temp.toggleCallback = method;
			}
			options = temp;
		}else{
			return consoleErr('Error Options,Please input Object,Sting or Function');
		}

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

		options = $.extend({}, DEFAULT, options instanceof Object ? options : { enterClass: options });

		options.enterClass !== '' 
		? (function(){
			// console.log(that);return ;
			options.enterDelay && setDuration.call(that, options.enterDelay);
			options.enterCallback && options.enterCallback.apply(that, arguments);
			$this.addAnimation(options.enterClass, function(){

				options.toggleCallback && options.toggleCallback.call(this);

				options.leaveClass ? (function(){
					options.leaveDelay && setDuration.call(that, options.leaveDelay);
					$this.addAnimation(options.leaveClass, function(){
						options.leaveCallback && options.leaveCallback.call(this);
					});
				})() : null;
			});
		})() : 
		console.log('Without Animated');
	};

}();