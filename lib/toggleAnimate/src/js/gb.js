//功能性相关的公用方法
window.gb = {
    on : function(obj){
        if(!$.isPlainObject(obj)) return;
        $.each(obj,function(selector,objs){
            var parent = '';
            var preventDefault = false;
            var selector = selector === 'window' ? window : selector === 'document' ? document : selector
            $.each(objs,function(event,func){
                switch(event){
                    case "parent" :
                        parent = func;
                    break;
                    default:
                        if(parent == ''){
                            $(selector).on(event,func);
                        }else{
                            $(parent).on(event,selector,func);
                        }
                    break;
                }
            });
        });
    },
    urlSearch : function(){
        var arg1 = arguments[0];
        var arg2 = arguments[1];
        var curSearch = window.location.search.slice(1).split('&');
        var arrs = {};
        $.each(curSearch,function(key,obj){
            if(obj!==''){
                var _this = obj.split("=");
                arrs[_this[0]] = _this[1];
            }
        });
        if($.isPlainObject(arg1)){
            window.history.pushState({'reload':true},document.title);
            $.each(arg1,function(k,v){
                if(v!==null) arrs[k] = v;
                else delete arrs[k];
            });
            var symbols = '';
            if ($.isEmptyObject(arrs)) symbols = '';
            else symbols = '?';
            var url = [
                '//',
                window.location.host,
                window.location.pathname,
                symbols,
                $.param(arrs),
                window.location.hash
            ];
            var newUrl = url.join('');
            window.history.replaceState({'reload':true},document.title,newUrl);
        }else if(arg2!==undefined){
            window.history.pushState({'reload':true},document.title);
            if(arg2!==null) arrs[arg1] = arg2;
            else delete arrs[arg1];
            var symbol = '';
            if ($.isEmptyObject(arrs)) symbol = '';
            else symbol = '?';
            var url = [
                '//',
                window.location.host,
                window.location.pathname,
                symbol,
                $.param(arrs),
                window.location.hash
            ];
            var newUrl = url.join('');
            window.history.replaceState({'reload':true},document.title,newUrl);
        }else{
            return arrs[arg1];
        }
    },
    cookie : function(){
        var arg1 = arguments[0];
        var arg2 = arguments[1];
        var str = document.cookie.split('; ');
        var cookies = {};
        $.each(str,function(k,val){
            var arr = val.split('=');
            cookies[arr[0]] = arr[1];
        });
        if($.type(arg1)==='string'){
            if(arg2===undefined){
                return unescape(cookies[arg1]);
            }else if(arg2===null){
                var ever = new Date();
                ever.setTime(0);
                document.cookie = arg1+"= ;expires="+ever.toString()+";path=/";
            }else{
                var future = new Date();
                future.setTime(future.getTime()+1000*60*60*24*365*100);
                document.cookie = arg1+'='+escape(arg2)+";expires="+future.toString()+";path=/";
            }
        }else if($.isPlainObject(arg1)){
            var newCookie = '';
            var obj = {};
            var year100 = new Date();
            if(arg1['expires']===undefined)
                year100.setTime(year100.getTime()+1000*60*60*24*365*100);
            else if(arg1['expires']==='session' || arg1['expires']==='Session')
                year100 = 'Session';
            else if($.isNumeric(arg1['expires']))
                year100.setTime(year100.getTime()+1000*60*60*24*arg1['expires']);
            var path = arg1['path'] || '/';
            $.each(arg1,function(keys,vals){
                if(keys!='expires' && keys!='path'){
                    if(vals===null) year100.setTime(0);
                    document.cookie = keys+'='+escape(vals)+";expires="+year100.toString()+";path="+path;
                }
            });
        }
    },
    clearCache : function(){
        $('script').each(function(){
            var src = $(this).attr('src');
            if(src===undefined) return;
            var random = parseInt(Math.random()*100000);
            if(src.search(/\?/)===-1) {
                src += '?t='+random;
            }else src += '&t='+random;
            $(this).attr('src',src);
        });
        $('link').each(function(){
            var href = $(this).attr('href');
            if(href===undefined) return;
            var random = parseInt(Math.random()*100000);
            if(href.search(/\?/)===-1) {
                href += '?t='+random;
            }else href += '&t='+random;
            $(this).attr('href',href);
        });
    },
    browser: {
        vs:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                ucweb: u.indexOf('UCBrowser') > -1,    //UC终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                weixin : u.indexOf("MicroMessenger") > -1, //是否微信环境
                isApp : u.indexOf("XRK") > -1 //是否im保险人的app
            };
        }()
    },

    local: function () {
        var key = arguments[0];
        var val = arguments[1];
        var isAddition = arguments[2] || false;
        if (val === undefined) {
            return window.localStorage.getItem(key);
        }else if (val === null) {
            window.localStorage.removeItem(key);
        }else{
            if (isAddition === true) {
                var data = window.localStorage.getItem(key) || '';
                window.localStorage.setItem(key, data + val);
            }else{
                window.localStorage.setItem(key, val);
            }
        }
    },
    
    loading: function() {
        var isShow = arguments[0];
        var isFullscreen = arguments[1] || false;
        if($('#gb-loading').length===0 && isShow === true){
            var loading = [];
            if (isFullscreen) {
                loading.push('<div class="gb-loading-mask" id="gb-loading-mask"></div>');
            }
            loading.push('<div class="gb-loading" id="gb-loading"></div>');
            
            $('body').append(loading.join(''));
            
        }else $('#gb-loading, #gb-loading-mask').remove();
    },
    alert: function() {
        if ($('#gb-alert').length!==0) return;
        var str = arguments[0];
        var alert = '<div class="gb-alert" id="gb-alert"><div class="gb-cell"><p>'+str+'</p></div></div>';
        $('body').append(alert);
        $('#gb-alert').one('click', function(){
            $('#gb-alert').remove();
            clearTimeout(tmShowAlt);
        });
        var tmShowAlt = setTimeout(function(){
            $('#gb-alert').remove();
        },1500);
    },
    preload: function (imgList) {
        var div = $('<div class="gb-preload" id="gb-preload"></div>');
        $('body').append(div);
        
        var timeout = 5000;

        var total = imgList.length,
            loaded = 0,
            imgages = [],
            _on = function () {
                ++loaded;
                render(loaded / total);
            };

        for (var i = 0; i < total; i++) {
            imgages[i] = new Image();
            imgages[i].onload = imgages[i].onerror = _on;
            imgages[i].src = imgList[i];
        }
        
        setTimeout(function () {
            render(1);
        }, timeout * total);
        
        function render(precent) {
            var number = Math.floor(precent * 100);
            div.text(number + '%');
            if (precent > 0.99) {
                div.addClass('hide');
                setTimeout(function() {
                    div.remove();
                }, 300);
            }
        }
    },
    /**
     * 需要先引入jquery
     * @param msg.upfile [可选]是否上传文件
     * @param msg.data     
     * @param msg.url 
     * @param msg.success 成功回调
     * @param msg.fail 失败回调
     **/
    ajax: function(msg) {

        var contentType = 'application/x-www-form-urlencoded';
        var processData = true;

        if(msg.upfile){
            contentType = processData = false;
        }
        $.ajax({
            type: 'post',
            data: msg.data,
            url: msg.url,
            contentType: contentType,
            processData: processData,
            dataType: 'json',
            cache: false,
            success: function(sender){
                if(sender.status == -1){
                    console.log('No Login!');
                    sender.noLogin && sender.noLogin(sender);
                }else if(sender.status == 0){
                    msg.success(sender);
                }else{
                    msg.fail ? msg.fail(sender) : alert(sender.msg);
                    console.log(sender.msg);
                }
            },
            error: function(){
                console.log('Error: Can Not Connet!');
            }
        });
    },
    shark_shark: function(sender){
        if(window.DeviceMotionEvent){
            window.addEventListener('devicemotion',deviceMotionHandler);
        }else{
            window.gb.alert('该设备不支持摇一摇功能，直接点击生成贺卡');
        }

        var MONITOR_SPACE_DEFAULT = 100,    //默认100毫秒监听一次
            MONITOR_SPACE = sender.monitor_space || MONITOR_SPACE_DEFAULT;
        var SHAKE_THRESHOLD_DEFAULT = 1500, //默认摇一摇阈值
            SHAKE_THRESHOLD = sender.threshold || SHAKE_THRESHOLD_DEFAULT;
        var last_update = 0;
        var x, y, z, last_x, last_y, last_z;
        function deviceMotionHandler(eventData) {

            var acceleration =eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();
            if ((curTime - last_update) >= MONITOR_SPACE) {   
                var diffTime = curTime - last_update;
                last_update = curTime;
                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;
                var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
                if (speed >= SHAKE_THRESHOLD) {
                    sender.callback && sender.callback.apply(this);
                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        }
    },
    /**
     * 记录当前页面的url，以便跳转后返回当前页
     * @param url（目标跳转url）
     * @return String（url）
     **/
    backUrl: function(url) {
        var flag = url.indexOf('?') == -1 ? '?' : '&';
        window.location.href = url + flag + "back=" + encodeURIComponent(window.location.href);
    },
    btn_loading: function($that){
        var index, counter = 0, step = 3;
        var strs = ['.','..','...'];
        var btnText = $that.text();

        $that.attr('disabled', true);
        var pointer = setInterval(function(){
            $that.text(btnText+strs[counter%step]);
            counter++;
        }, 1000);
        return pointer;
    },
    /**
     * 获取url参数
     * @param href (带参数的)
     * @return Array (参数对象)
     **/
    urlParams: function(href){
        var param = {}, temp;

        if(href.indexOf('?') < 0) return false;   
        var paramStr = href.split('?')[1].split('&');
        $.each(paramStr, function(index, value){
            temp = value.split('=');
            param[temp[0]] = decodeURI(decodeURIComponent(temp[1])); 
        });
        return param;
    },
    jsApiCall: function(sender){
        var wxconfig = sender.wxconfig;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wxconfig.appId,     //公众号名称，由商户传入     
                "timeStamp": wxconfig.timeStamp,         //时间戳，自1970年以来的秒数     
                "nonceStr": wxconfig.nonceStr, //随机串     
                "package": wxconfig.package,     
                "signType": wxconfig.signType,         //微信签名方式：     
                "paySign": wxconfig.paySign //微信签名 
            },
            function(res){     
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    sender.success && sender.success();
                }else{
                    sender.fail && sender.fail();
                }     
            }
        ); 
    },
    weui_loading: function(sender, callback){
        if(sender == 'hide' || sender == 'show'){
            var command = sender;
            command == 'hide' ? $("#loadingToast").fadeOut('fast' ,function(){
                callback && callback();
            }) : $("#loadingToast").fadeIn('fast');
        }else{
            var tip = sender || '数据加载中';
            $("#loadingToast").length ? (function(){
                $("#loadingToast .weui-toast__content").text(tip);
                $("#loadingToast").fadeIn('fast');
            })() : (function(){
                var loadingHtml = '<div id="loadingToast" style="display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-loading weui-icon_toast"></i><p class="weui-toast__content">'+tip+'</p></div></div>';
                $("body").append(loadingHtml);
                $("#loadingToast").fadeIn();
            })()
        }

    },
    weui_toast: function(tip, icon){

        tip = tip || '已完成';
        $("#toast").length ? (function(){
            if(icon){
                iconclass = "weui-icon-"+icon+"-no-circle"+" weui-icon_toast";
                $("#toast .weui-toast>i").attr('class', iconclass);
            }
            $("#toast .weui-toast__content").text(tip);
            $("#toast").fadeIn('fast');
        })()
        : (function(){
            icon = icon || 'weui-icon-success-no-circle';
            var toastHtml = '<div id="toast" style="display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="'+icon+' weui-icon_toast"></i><p class="weui-toast__content">'+tip+'</p></div></div>';
            $("body").append(toastHtml);
            $("#toast").fadeIn('fast'); 
        })();

        setTimeout(function(){
            $("#toast").fadeOut();
        }, 1000);
        
    },
    weui_dialog: function(sender){

        var DIALOG = '#iosDialog1',
            HEAD = '#iosDialog1 .weui-dialog__title',
            CONTENT = '#iosDialog1 .weui-dialog__bd',
            CANCEL = '#iosDialog1 .weui_cancel',
            CONFIRM = '#iosDialog1 .weui_confirm';

        var isObject = sender instanceof Object;

        var DEFAULT = {
            head: '系统提示',
            content: '',
            cancel: '取消',
            confirm: '确定',
        }

        var sender = isObject ? $.extend({}, DEFAULT, sender) : $.extend({}, DEFAULT, {content: sender});

        $(document).focus();
        $("#iosDialog1").length ? (function(){
            $(HEAD).text(sender.head);
            $(CONTENT).text(sender.content);
            $(DIALOG).fadeIn('fast');
        })()
        : (function(){
            var dialogHtml = '<div class="js_dialog" id="iosDialog1" style="opacity: 1;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">'+sender.head+'</strong></div><div class="weui-dialog__bd">'+sender.content+'</div><div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default weui_cancel">'+sender.cancel+'</a><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary weui_confirm">'+sender.confirm+'</a></div></div></div>';

            $("body").append(dialogHtml);
            $(DIALOG).fadeIn('fast');

            $(document).on('click', CANCEL, function(){
                $(DIALOG).fadeOut('fast');
            });

            $(document).on('click', CONFIRM, function(){
                sender.callback && sender.callback.call(this);
                $(DIALOG).fadeOut('fast');
            }) 
        })();
    },
    weui_alert: function(sender){
        var ALERT = '#dialog2',
            HEAD = '#dialog2 .weui-dialog__title',
            CONTENT = '#dialog2 .weui-dialog__bd',
            CANCEL = '#dialog2 .weui_cancel';

        var DEFAULT = {
            head: '系统提示',
            content: '',
            cancel: '知道了',
        }

        var isObject = sender instanceof Object;

        var sender = isObject ? $.extend({}, DEFAULT, sender) : $.extend({}, DEFAULT, {content: sender});

        $(ALERT).length ? (function(){
            $(HEAD).html(sender.head);
            $(CONTENT).html(sender.content);
            $(ALERT).fadeIn('fast');
        })()
        : (function(){
            var html = '<div class="js_dialog" id="dialog2" style="opacity: 1;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">'+sender.head+'</strong></div><div class="weui-dialog__bd">'+sender.content+'</div><div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default weui_cancel">'+sender.cancel+'</a></div></div></div>';

            $("body").append(html);
            $(ALERT).fadeIn('fast');
            $(document).on('click', CANCEL, function(){
                $(ALERT).fadeOut('fast');
                sender.callback && sender.callback.call(this);
            });

        })();
    },
}