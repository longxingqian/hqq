(function (app) {
    var selectwx = "";
    var fy4data  = [];
    var fy2data  = [];
    var fy4index = 0;
    var fy2index = 0;
    var FY4      = ["TRUE_COLOR","VISIBLE","INFRARED","WATER_VAPOUR"];
    var FY2      = ["","",""];
    var timeInterval;
    var fy4playindex;
    var fy2playindex;
    function init() {
        //三方图片浏览库
        new RTP.PinchZoom(".m-zoom-img", {});
        //事件监听
        _addListner();
        //默认进度
        $('.m-axis-silder-bar').val(0).attr({min:0,max:2}).slider();
        //默认选中第一个卫星
        $(".radarbg .radartitle li").first().click();
    }
    //事件监听
    function _addListner(){
        $(".pinch-zoom-container").css({
            "position": "static",
            "zIndex": "99",
        });
        //卫星标题点击事件
        $(".radarbg .radartitle").on("click", "li", function () {
            stop();
            if($(this).hasClass("select")){
                return ;
            }
            //移除除自己外同级其他元素class等于select属性
            $(this).addClass("select").siblings().removeClass("select");
            //获取卫星类型
            selectwx= $(this).data("ele");
            if (selectwx == "fy4"){
                $(".radarcontenttitle").show();
                if (fy4data.length == 0){
                    var $li = $(".radarcontenttitle ul li").eq(fy4index);
                    $li.click();
                } else {//重点 重置进度条 重置已经选中的云图类型
                    $('.m-axis-silder-bar').val(fy4playindex).attr({min:0,max:fy4data.length - 1}).slider();
                    var liarr = $(".radarcontenttitle ul li");
                    $.each(liarr,function (index,value) {
                        $(value).removeClass("select");
                        $(value).find("img").hide();
                        if (index == fy4index) {
                            $(value).addClass("select");
                            $(value).find("img").show();
                        }
                    })
                    setImageIndex(fy4playindex);
                }
            }else {
                $(".radarcontenttitle").hide();
                if (fy2data.length == 0){
                    app.proxy.getSatelliteDataWithCode1("O_SWP_LDTP");
                }else {//重置进度条 重置已经选中的云图类型
                    $('.m-axis-silder-bar').val(fy2playindex).attr({min:0,max:fy2data.length-1}).slider();
                    setImageIndex(fy2playindex);
                }
            }
        });
        //云图标题点击事件
        $(".radarcontenttitle ul").on("click", "li", function (){
            stop();
            var liarr = $(".radarcontenttitle ul li");
            $.each(liarr,function (index,value) {
                $(value).removeClass("select");
                $(value).find("img").hide();
            })
            $(this).addClass("select");
            $(this).find("img").show();
            //拿到索引
            var dataindex= $(this).data("code");
            //根据卫星改变云图code
            if (selectwx == "fy4"){
                fy4index = dataindex;
                app.proxy.getSatelliteDataWithCode(FY4[fy4index]);
            }else {
                fy2index = dataindex;
                app.proxy.getSatelliteDataWithCode(FY2[fy2index]);
            }
        });
        //上一张
        $(".radarcontentbtn .playleft").on("click",function () {
            stop();
            var lindex = Number($(".m-axis-silder-bar").val());
            lindex     = Math.max(lindex-1,0);
            setImageIndex(lindex);
        })
        //播放暂停
        $(".radarcontentbtn .playcenter").on("click",function () {
            $(this).toggleClass("stop");
            if($(this).hasClass("stop")){
                $(".radarcontentbtn .playcenter").attr("src","images/satellitePuzzle/WeatherRadar_stop.png");
                paly();
            }else {
                stop();
            }
        })
        //下一张
        $(".radarcontentbtn .playright").on("click",function () {
            stop();
            var nindex   = Number($(".m-axis-silder-bar").val());
            var nlegth;
            if (selectwx == "fy4"){
                nlegth   = fy4data.length - 1;
            }else {
                nlegth   = fy2data.length - 1;
            }
            nindex       = Math.min(nindex+1,nlegth);
            setImageIndex(nindex);
        })
        //进度条
        $(".m-axis-silder-bar").change(function () {
            var srcindex     = +$(this).val();
            var srctime,srcpath,title;
            var radcss       = "";
            if (selectwx == "fy4"){
                fy4playindex = srcindex;
                var fy4item  = fy4data[srcindex];
                srctime      =  new Date(fy4item["PRODUCTTIME"].replace(/-/g, '/')).Format("yyyy年MM月dd日 hh:mm");
                srcpath      = fy4item["FILEPATH"];
                title        = $(".radarcontenttitle").find("li.select").find("span").text();
                radcss       = "translateX(-200px)";
            }else {
                fy2playindex = srcindex;
                var fy2item  = fy2data[srcindex];
                srctime      = new Date(fy2item["PRODUCTTIME"].replace(/-/g, '/')).Format("yyyy年MM月dd日 hh:mm");
                srcpath      = fy2item["FILEPATH"];
                title        = "";
                radcss       = "translateX(-100px)";
            }
            $(".radarcontentdata .title").html(title);
            $(".radarcontentdata .subtitle").html(srctime);
            $(".press>p").html(srctime);
            console.log(srcpath);
            $(".m-zoom-img .show-img").attr("src",srcpath);
            // $(".pinch-zoom-container").css({
            //     "transform": radcss
            // });
            if(selectwx=="fy4" && srcindex==fy4data.length -1){
                fy4playindex = 0;
                stop();
            }
            if(selectwx=="fy2" && srcindex==fy2data.length -1){
                fy2playindex = 0;
                stop();
            }
        })
        //以下方法2选一
        $(".m-axis-silder").mousedown(function () {//按下
            stop();
        })
        // $(".m-axis-silder-bar").on("slidestop",function () {//拖动结束
        //     stop();
        // })
    }
    //处理云图数据
    function setSatelliteData(data){
        if(data && data.length > 0) {
            var selectlast;
            if (selectwx == "fy4"){
                fy4data      = data;
                selectlast   = fy4data.length;
                fy4playindex = 0;
            }else {
                fy2data      = data;
                selectlast   = fy2data.length;
                fy2playindex = 0;
            }
            $('.m-axis-silder-bar').val(selectlast-1).attr({min:0,max:selectlast-1}).slider();
            setImageIndex(selectlast-1);
        }
    }
    //播放
    function paly(){
        var $this   = $(".radarcontentbtn .playcenter");
        timeInterval= setInterval(function () {
            var sc  = $this.hasClass("stop");
            if (selectwx == "fy4"){
                if (sc && fy4playindex<fy4data.length-1){
                    setImageIndex(fy4playindex);
                    fy4playindex++;
                }else if(sc && fy4playindex==fy4data.length-1) {
                    setImageIndex(fy4data.length-1);
                }else {
                    fy4playindex = 0;
                    stop();
                }
            } else {
                if (sc && fy2playindex<fy2data.length-1){
                    setImageIndex(fy2playindex);
                    fy2playindex++;
                }else if(sc && fy2playindex==fy2data.length-1) {
                    setImageIndex(fy2data.length-1);
                }else {
                    fy2playindex = 0;
                    stop();
                }
            }
        },1000);
    }
    //暂停
    function stop(){
        $(".radarcontentbtn .playcenter").removeClass('stop');
        $(".radarcontentbtn .playcenter").attr("src","images/satellitePuzzle/WeatherRadar_play.png");
        timeInterval&&clearInterval(timeInterval);
    }
    //改变图片
    function setImageIndex(index){
        $('.m-axis-silder-bar').val(index).change();
    }
    //对外提供
    app.panel={
        init:init,
        setSatelliteData: setSatelliteData
    }
})(window.app);