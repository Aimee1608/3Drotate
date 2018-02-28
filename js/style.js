/******rem *******/
(function(win){
    var remCalc = {};
    var docEl = win.document.documentElement,
        tid,
        hasRem = true;
    hasZoom = true;
    designWidth = 750;
    function refresh(){
        var width = docEl.getBoundingClientRect().width;
        if(hasRem){
            var rem = width/10;
            docEl.style.fontSize = rem + "px";
            remCalc.rem = rem;
            var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
            if(actualSize!== rem && actualSize>0 && Math.abs(actualSize-rem)>1){
                var remScaled = rem*rem/actualSize;
                docEl.style.fontSize = remScaled + "px";
            }
        }
        if(hasZoom){
            var style = document.getElementById('y_style');
            if(!style){
                style = document.createElement('style');
                style.id = 'y_style';
            }
            style.innerHTML = '._z{zoom:'+ width/designWidth + '}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
    function dbcRefresh(){
        clearTimeout(tid);
        tid = setTimeout(refresh,100);
    }
    win.addEventListener("resize",function(){
        dbcRefresh()
    },false);
    win.addEventListener("pageshow",function(e){
        if(e.persisted){
            dbcRefresh()
        }
    },false);
    refresh();
    if(hasRem){
        remCalc.refresh = refresh;
        remCalc.rem2px = function(d){
            var val = parseFloat(d)/this.rem;
            if(typeof d==="string" && d.match(/px$/)){
                val+="rem";
            }
            return val
        };
        win.remCalc = remCalc;
    }
})(window);


function ImgLoadingByFile(imgArray,loadPageID,loadTxtID,showpageID){
    function complete(long){
        musicStar.load();
        var timer02 = setTimeout(function(){
            $('#'+loadTxtID).fadeOut();
            $(".begin").show();
            $(".begin").on('touchstart',function(){
                $('#'+loadPageID).fadeOut(500);
                $('.page-box').show();
                $('.btn-music').show();
                musicStar.pause();
                musicStar.play();
                init();
                o.init();
                animate();
                var timer04 = setTimeout(function(){
                    $('.xuan').fadeOut(800);
                    clearTimeout(timer04);
                    timer04 = null;
                },2000);
            });
            //音乐
            clearTimeout(timer02);
            timer02 = null;
        },long);
    }
    if(sessionStorage.getItem("pageloaded")){
        $('#'+loadTxtID).html('loading...100%');
        complete(1300);
    }else{

        var imgLoad = 0;
        var btime = new Date();
        if(imgArray.length>0){
            var imgTotal = imgArray.length;
            var percent = 0;
            var img = [];
            for(var i = 0;i<imgArray.length;i++){
                img[i] = new Image();
                img[i].src=imgArray[i];
                img[i].onload = function(){
                    imgLoad++;
                    percent = parseInt(imgLoad/imgTotal*100);
                    $('#'+loadTxtID).html('loading...'+percent+'%');
                    //console.log(percent);

                    if(percent>=100){
                        var etime = new Date();
                        console.log(etime-btime);
                        if(etime-1000>btime){
                            complete(100);
                        }else{
                            complete(500);
                        }
                        //alert(etime-btime);
                        sessionStorage.setItem("pageloaded", "true");

                    }
                }
            }
        }
    }
}

//横屏
function landscape(){
    //var w = window.innerWidth;
    //var h = window.innerHeight;
    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    $("body").css({"width":w,"height":h});
    $('#page-landscape').css({"width":w,"height":h}).show();
    $('#page-portrait').css({"width":w,"height":h});
    //$('#page-landscape').show();
}
var firstInit = true;
//竖屏
function portrait(){
    var w = window.Utils.windowW();
    var h = window.Utils.windowH();
    //初始化加载
    if(firstInit){
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();
        var imgFile = [
            "img/share.jpg",
            "img/music-close.png",
            "img/music-open.png",
            "img/phone.png",
            "img/loadingbg2.jpg",
            "img/btn.png",
            "img/dog.png",
            "img/dogtext.png",
            "img/fu.png",
            "img/fubg.png",
            "img/xuan02.png",
            "img/home.png",
            "img/LOGO.png",
            "img/bg05.jpg",
            "img/bg05small.jpg"
        ];
        ImgLoadingByFile(imgFile,'loadingPage','loadTxt','pageContainer');
        firstInit = false;
    }else {
        //$('#page-portrait').show();
        //$('#page-landscape').hide();
        $("body").css({"width":w,"height":h});
        $('#page-portrait').css({"width":w,'height':h}).show();
        $('#page-landscape').hide();
    }

    $('.btn-music').on('touchstart',function(e){
        //e.returnValue = true;
        if(musicStar.paused){
            musicStar.play();
            $('.open').show();
            $('.clock').hide();
            //alert(889);
        }else{
            musicStar.pause();
            $('.open').hide();
            $('.clock').show();
            //alert(999);
        }
    });
}

(function() {
    "use strict";

    function Utils() {
    }

    Utils.isWeiXin = function(){
        return navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/);
    };
    Utils.isQQ = function(){
        return navigator.userAgent.ua.match(/QQ\/([\d\.]+)/);
    };
    Utils.isQZone = function(){
        return navigator.userAgent.ua.indexOf("Qzone/") !== -1;
    };

    Utils.isIos = function() {
        return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };
    Utils.isIPhone = function() {
        return navigator.userAgent.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    };
    Utils.isIpad = function() {
        return navigator.userAgent.indexOf('iPad') > -1;
    };
    Utils.isAndroid = function() {
        var u = navigator.userAgent;
        return navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    };
    Utils.isMobile = function() {
        // var u = navigator.userAgent;
        return navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i) != null;
    };

    // ## 屏幕方向
    Utils.isPortrait = function() {
        if (!Utils.isMobile()) {
            //alert(111);
            return true;

        }
        // 安卓版 微信里面 只用判断 width 和 height
        if (Utils.isAndroid() && Utils.isWeiXin()) {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(22);
                return true;

            } else {
                //alert(331);
                return false;

            }
        }
        var orientation = window['orientation'];
        if (orientation||orientation==0) {
            if (orientation == 90 || orientation == -90) {
                //alert(4442);
                return false;

            }else{
                //alert(555111);
                return true;

            }
        } else {
            if (Utils.windowW() < Utils.windowH()) {
                //alert(666111);
                return true;

            } else {
                //alert(777111);
                return false;

            }
        }
    };
    // ## jquery 获取 window 的宽度
    Utils.windowW = function() {
        // var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return $(window).width();
    };
    // ## jquery 获取 window 的高度
    Utils.windowH = function() {
        return $(window).height();
    };
    window.Utils = Utils;
}());


function  onResize() {
    if(Utils.isPortrait()){
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            var timer = setTimeout(function(){
                portrait();
                clearTimeout(timer);
                timer = null;
            },100);
        }else{
            portrait();
        }
    } else {
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            var timer = setTimeout(function(){
                landscape();
                clearTimeout(timer);
                timer = null;
            },200);
        }else{
            landscape();
        }
    }
}
$(function(){
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", onResize, false);
    }else{
        window.addEventListener( "resize", onResize, false);
    }
});
onResize();