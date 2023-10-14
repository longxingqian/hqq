$(function () {
    let openid = "";
    let wxcode = getQueryVariable("code");
    let maxnum;
    if(!wxcode) {
        window.location.href = "loading.html?url="+location.href;
    }
    SW.Rpc.BaseProxy.include({
        //用户定制的预警
        WarningOrder_GetSXOrderByCode: function (successFun, errorFun) {
            var params = [wxcode];
            return this.invoke('WarningOrder.GetSXOrderByCode', params, 5, successFun, errorFun);
        },
        //保存预警
        WarningOrder_SaveSXOrderByCode: function (orderArea,orderTime,orderLevel,orderDesc,successFun, errorFun) {
            var params = [];
            params     = params.concat("",openid,orderArea,orderTime,orderLevel,orderDesc,"");
            return this.invoke('WarningOrder.SaveSXOrderByCode', params, 5, successFun, errorFun);
        },
    });
    let hqproxy = new SW.Rpc.BaseProxy({
        rootURL: "http://www.cdsqxt.com.cn:10003",
        serviceUrl: '/Project/WorkInstruction',
    });
    let proxy = new SW.Rpc.BaseProxy({
        rootURL: "http://www.cdsqxt.com.cn:10003",
        serviceUrl: '/Project/WorkInstruction',
        calltype:5,
        ws: SW.ws2_1_Promise({type: "POST"})
    });
    function init() {
        $(".time").text(localStorage.getItem("myctime"));
        _addListner();
        getArea();
        getAlert();
    }
    function getArea(){
        $.getJSON("resources/myzhandian.json?t=20220803",function (data) {
            console.log(data);
            var phtml= "";
            for(var i=0;i<data.child.length;i++){
                var item = data.child[i];
                phtml+=`<ul>
                            <div class="tankcontenttop">
                                <div class="tankcontenttopl">
                                    <div></div>
                                    <span>${item.city}</span>
                                </div>
                                <div class="tankcontenttopr">
                                    <img src="images/alarm/radarunselect.png" alt="">
                                    <span>全选</span>
                                </div>
                            </div>
                            <div class="tankcontentbottom">
                                ${getcity(item.child)}
                            </div>
                        </ul>`
            }
            $(".tankcontent").html(phtml);
            var quanarr   = $(".tankcontent li");
            maxnum        = quanarr.length;
            $(".tanktitler").click();
        });
    }
    function getcity(data){
        var chtml= "";
        for(var i=0;i<data.length;i++){
            var item = data[i];
            chtml+=`<li  data-code=${item.areacode}>
                        <img src="images/alarm/radarunselect.png" alt="">
                        <span>${item.name}</span>
                    </li>`
        }
        return chtml;
    }
    //获取预警
    function getAlert(){
         getGroup(yjconfig);
         getGetErdsOrder();
    }
    //预警分组
    function getGroup(data){
        var qtqlist= [];//强天气
        var hslist = [];//寒暑
        var cxlist = [];//出行天气
        var hjlist = [];//罕见天气
        var qtlist = [];//其他预警
        for (var i = 0; i  < data.length; i ++) {
            var qxys = data[i];
            if(qxys.dataType == 1){
                qtqlist.push(qxys);
            }
            if(qxys.dataType == 2){
                hslist.push(qxys);
            }
            if(qxys.dataType == 3){
                cxlist.push(qxys);
            }
            if(qxys.dataType == 4){
                hjlist.push(qxys);
            }
            if(qxys.dataType == 5){
                qtlist.push(qxys);
            }
        }
        let ListHtml="";
        if(qtqlist.length>0){
            var qtqtitle = "强天气";
            ListHtml   +=`<ul class="myCustomalertListul">
                            <div class="myCustomalertListulTitle">
                               <div class="myCustomalertListulTitleleft"></div>
                               <div class="myCustomalertListulTitlecenter">${qtqtitle}</div>
                               <div class="myCustomalertListulTitleright"></div>
                            </div>
                            ${getLi(qtqlist)}
                          </ul>`;
        }
        if(hslist.length>0){
            var hstitle = "寒暑"
            ListHtml   +=`<ul class="myCustomalertListul">
                             <div class="myCustomalertListulTitle">
                               <div class="myCustomalertListulTitleleft"></div>
                               <div class="myCustomalertListulTitlecenter">${hstitle}</div>
                               <div class="myCustomalertListulTitleright"></div>
                             </div>
                            ${getLi(hslist)}
                          </ul>`;
        }
        if(cxlist.length>0){
            var cxtitle = "出行天气"
            ListHtml   +=`<ul class="myCustomalertListul">
                            <div class="myCustomalertListulTitle">
                              <div class="myCustomalertListulTitleleft"></div>
                              <div class="myCustomalertListulTitlecenter">${cxtitle}</div>
                              <div class="myCustomalertListulTitleright"></div>
                            </div>
                            ${getLi(cxlist)}
                          </ul>`;
        }
        if(hjlist.length>0){
            var hjtitle = "罕见天气"
            ListHtml   +=`<ul class="myCustomalertListul">
                            <div class="myCustomalertListulTitle">
                               <div class="myCustomalertListulTitleleft"></div>
                               <div class="myCustomalertListulTitlecenter">${hjtitle}</div>
                               <div class="myCustomalertListulTitleright"></div>
                            </div>
                            ${getLi(hjlist)}
                          </ul>`;
        }
        $(".myCustomalert .myCustomalertList").html(ListHtml);
    }
    //每个预警
    function getLi(data){
        let liHtml = "";
        for (var j = 0; j < data.length; j++) {
            var lidic = data[j];
            liHtml   +=`<li class="myCustomalertListli" data-code = "6">
                           <img class="typeImg" src="images/alarm/${lidic.name}.png" alt="">
                           <div class="typeSpan">
                             <span>${lidic.name}</span>
                             <img src="images/alarm/myCustomBlack.png" alt="">
                           </div>
                           <div class="typeROYB">
                             <i class="red"></i>
                             <i class="orange"></i>
                             <i class="yellow"></i>
                             <i class="blue"></i>
                           </div>
                           <div class="typeSelect">
                             <ul>
                               ${getType(lidic.childNodes)}
                             </ul>
                           </div>
                        </li>`
        }
        return liHtml;
    }
    //每个预警下的预警类型    
    function getType(data){
        let typeHtml= '<li data-code="1">接收全部</li>';
        for (var m  = 0; m < data.length; m++) {
            var typedic   = data[m];
            if(typedic.name.indexOf("红") != -1){
                typeHtml +=`<li data-code="4">仅红色</li>`;
            }else if(typedic.name.indexOf("橙") != -1){
                typeHtml +=`<li data-code="3">橙色以上</li>`;
            }else if(typedic.name.indexOf("黄") != -1){
                typeHtml +=`<li data-code="2">黄色以上</li>`;
            }
        }
        typeHtml +=`<li data-code="5">不接收</li>`;
        return typeHtml;
    }
    //已选
    function getGetErdsOrder() {
        hqproxy.WarningOrder_GetSXOrderByCode(function (res){
            console.log(res);
            getselectData(res);
        });
    }
    //用户已选择的
    function getselectData(data){
        var message   = data.message;
        if(message.openId.length>0){
            openid  = message.openId;
        }
        //地区定制
        var orderArea = message.orderArea;
        if(orderArea.length>0){
            //去掉地区选中
            $(".tankcontent li").removeClass("select")
            $(".tankcontent li img").attr("src","images/alarm/radarunselect.png")
            //去掉全选选中
            $(".tankcontent").find(".tankcontenttopr").removeClass("select");
            $(".tankcontent").find(".tankcontenttopr img").attr("src","images/alarm/radarunselect.png");
            //去掉全省选中
            $(".tanktitler").removeClass("select");
            $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
            //去掉省台选中
            $(".tanktitlec").removeClass("select");
            $(".tanktitlec").find("img").attr("src","images/alarm/radarunselect.png");
            //重新改变地区
            var arealist = orderArea.split(",");
            var areali   = $(".tankcontent li");
            for(var s = 0; s<arealist.length;s++){
                var scode = arealist[s];
                $.each(areali,function (index,value) {
                    var code = $(value).attr("data-code");
                    if(scode == code){
                        $(value).click();
                    }
                });
            }
            if(arealist.length == maxnum){
                $(".myCustomAreaTitleright span").text("全市")
            }else{
                if(orderArea==""){
                    $(".myCustomAreaTitleright span").text("已选择"+0+"个地区")
                }else{
                    $(".myCustomAreaTitleright span").text("已选择"+arealist.length+"个地区")
                }
            }
        }
        //订阅时间
        var orderTime = message.orderTime;
        if(orderTime == 1){
            $(".myCustomTimeTileright span").text("全天");
            $(".myCustomTimeSelect ul li").eq(0).addClass("select");
        }else{
            $(".myCustomTimeTileright span").text("白天(7:00~22:00)");
            $(".myCustomTimeSelect ul li").eq(1).addClass("select");
        }
        //订阅等级
        var orderlevel = message.orderLevel;
        if(orderlevel ==1){//接收全部
            $(".myCustomLevelTitleright span").text("接收全部");
            $(".myCustomLevelSelect ul li").eq(0).addClass("select");
        }else if(orderlevel ==2){//黄色myCustomLevelTitleright以上
            $(".myCustomLevelTitleright span").text("接收黄色以上");
            $(".myCustomLevelSelect ul li").eq(1).addClass("select");
        }else if(orderlevel ==3){//橙色以上
            $(".myCustomLevelTitleright span").text("接收橙色以上");
            $(".myCustomLevelSelect ul li").eq(2).addClass("select");
        }else if(orderlevel ==4){//仅红色
            $(".myCustomLevelTitleright span").text("仅接收红色");
            $(".myCustomLevelSelect ul li").eq(3).addClass("select");
        }else if(orderlevel ==5){//自定义
            $(".myCustomLevelTitleright span").text("自定义");
            $(".myCustomLevelSelect ul li").eq(4).addClass("select");
        }else{//不接收
            $(".myCustomLevelTitleright span").text("不定制");
            $(".myCustomLevelSelect ul li").eq(5).addClass("select");
        }
        //订阅预警
        var  orderDesc = message.orderDesc;
        if(orderDesc != undefined&&orderDesc !=""){
            var  desclist  = JSON.parse(orderDesc.replace(/'/g,"\""));
            var  alertli   = $(".myCustomalert .myCustomalertListli");
            for (var b = 0; b < desclist.length; b++) {
                var desc = desclist[b];
                $.each(alertli,function (index,value) {
                    var typetext  = $(value).find(".typeSpan span").text();
                    if(desc.signalType == typetext){
                        if(desc.orderlevel ==1){//接收全部
                            $(value).attr("data-code",1);
                            $(value).find(".typeROYB i").show();
                            $(value).find(".typeSelect ul li").eq(0).addClass("select");
                            $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                        }else if(desc.orderlevel ==2){//接收黄色以上
                            $(value).attr("data-code",2);
                            $(value).find(".red,.orange,.yellow").show();
                            $(value).find(".blue").hide();
                            $(value).find(".typeSelect ul li").eq(1).addClass("select");
                            $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                        }else if(desc.orderlevel ==3){//接收橙色以上
                            $(value).attr("data-code",3);
                            $(value).find(".red,.orange").show();
                            $(value).find(".yellow,.blue").hide();
                            $(value).find(".typeSelect ul li").eq(2).addClass("select");
                            $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                        }else if(desc.orderlevel ==4){//仅红色
                            $(value).attr("data-code",4);
                            $(value).find(".red").show();
                            $(value).find(".orange,.yellow,.blue").hide();
                            $(value).find(".typeSelect ul li").eq(3).addClass("select");
                            $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                        }else if(desc.orderlevel ==5){//不接收
                            $(value).attr("data-code",6);
                            $(value).find(".typeROYB i").hide();
                            $(value).find(".typeSelect ul li").eq(4).addClass("select");
                            $(value).find(".typeImg").attr("src",`images/alarm/${typetext}.png`);
                        }
                    }
                })
            }
        }
    }
    //监听
    function _addListner(){
        //预警地区选中
        $(".myCustomAreaList").on("click", "li", function (){
            $(this).toggleClass("select");
            var isselect = false;
            if($(this).hasClass("select")){
                isselect = true;
            }else {
                isselect = false;
            }
            var imagename= isselect?"radarselect":"radarunselect";
            $(this).find("img").attr("src",`images/alarm/${imagename}.png`);
        });
        //新地区
        $(".myCustomAreaTitleright").on("click", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(".tank").show();
            }else {
                $(".tank").hide();
            }
        });
        //关闭
        $(".tankclose img").on("click", function (){
            $(".myCustomAreaTitleright").removeClass("select");
            $(".tank").hide();
            //计算
            var isquannum = 0;
            var quanarr   = $(".tankcontent li");
            $.each(quanarr,function (index,value) {
                if($(value).hasClass("select")){
                    isquannum = isquannum+1;
                }
            });
            if(isquannum == maxnum){
                $(".myCustomAreaTitleright span").text("全市")
            }else{
                $(".myCustomAreaTitleright span").text("已选择"+isquannum+"个地区")
            }
        });
        //陕西省
        $(".tanktitlec").on("click", function (){
            $(this).toggleClass("select");
            // $(".tanktitler").removeClass("select");
            // $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
            if($(this).hasClass("select")){
                $(this).find("img").attr("src","images/alarm/radarselect.png");
                // $(".tankcontent").find("li").removeClass("select");
                // $(".tankcontent").find("li img").attr("src","images/alarm/radarunselect.png");
                // $(".tankcontent").find(".tankcontenttopr").removeClass("select");
                // $(".tankcontent").find(".tankcontenttopr img").attr("src","images/alarm/radarunselect.png");
            }else {
                $(this).find("img").attr("src","images/alarm/radarunselect.png");
            }
        });
        //全省
        $(".tanktitler").on("click", function (){
            $(this).toggleClass("select");
            // $(".tanktitlec").removeClass("select");
            // $(".tanktitlec").find("img").attr("src","images/alarm/radarunselect.png");
            if($(this).hasClass("select")){
                $(this).find("img").attr("src","images/alarm/radarselect.png");
                $(".tankcontent").find("li").addClass("select");
                $(".tankcontent").find("li img").attr("src","images/alarm/radarselect.png");
                $(".tankcontent").find(".tankcontenttopr").addClass("select");
                $(".tankcontent").find(".tankcontenttopr img").attr("src","images/alarm/radarselect.png");
            }else {
                $(this).find("img").attr("src","images/alarm/radarunselect.png");
                $(".tankcontent").find("li").removeClass("select");
                $(".tankcontent").find("li img").attr("src","images/alarm/radarunselect.png");
                $(".tankcontent").find(".tankcontenttopr").removeClass("select");
                $(".tankcontent").find(".tankcontenttopr img").attr("src","images/alarm/radarunselect.png");
            }
        });
        //全选
        $(".tankcontent").on("click",".tankcontenttopr", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(this).find("img").attr("src","images/alarm/radarselect.png");
                $(this).parents("ul").find("li").addClass("select");
                $(this).parents("ul").find("li img").attr("src","images/alarm/radarselect.png");
                //计算省
                var isquans = true;
                var quanarr = $(".tankcontent li");
                $.each(quanarr,function (index,value) {
                    if(!$(value).hasClass("select")){
                        isquans = false;
                    }
                });
                if(isquans){
                    $(".tanktitler").addClass("select");
                    $(".tanktitler").find("img").attr("src","images/alarm/radarselect.png");
                }else{
                    $(".tanktitler").removeClass("select");
                    $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
                }
            }else{
                $(this).find("img").attr("src","images/alarm/radarunselect.png");
                $(this).parents("ul").find("li").removeClass("select");
                $(this).parents("ul").find("li img").attr("src","images/alarm/radarunselect.png");
                $(".tanktitler").removeClass("select");
                $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
            }
        });
        //点一个计算一次
        $(".tankcontent").on("click","li", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(this).find("img").attr("src","images/alarm/radarselect.png");
                //计算市
                var isquanx  = true;
                var quanxarr = $(this).parents("ul").find("li");
                $.each(quanxarr,function (index,value) {
                    if(!$(value).hasClass("select")){
                        isquanx = false;
                    }
                });
                if(isquanx){
                    $(this).parents("ul").find(".tankcontenttopr").addClass("select");
                    $(this).parents("ul").find(".tankcontenttopr img").attr("src","images/alarm/radarselect.png");
                }else{
                    $(this).parents("ul").find(".tankcontenttopr").removeClass("select");
                    $(this).parents("ul").find(".tankcontenttopr img").attr("src","images/alarm/radarunselect.png");
                }
                //计算省
                var isquans = true;
                var quanarr = $(".tankcontent li");
                $.each(quanarr,function (index,value) {
                    if(!$(value).hasClass("select")){
                        isquans = false;
                    }
                });
                if(isquans){
                    $(".tanktitler").addClass("select");
                    $(".tanktitler").find("img").attr("src","images/alarm/radarselect.png");
                }else{
                    $(".tanktitler").removeClass("select");
                    $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
                }
            }else{
                $(this).find("img").attr("src","images/alarm/radarunselect.png");
                $(this).parents("ul").find(".tankcontenttopr").removeClass("select");
                $(this).parents("ul").find(".tankcontenttopr img").attr("src","images/alarm/radarunselect.png");
                $(".tanktitler").removeClass("select");
                $(".tanktitler").find("img").attr("src","images/alarm/radarunselect.png");
            }
        });
        //订阅时间
        $(".myCustomTimeTileright").on("click", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(".myCustomTimeSelect").show();
            }else {
                $(".myCustomTimeSelect").hide();
            }
        });
        //时间选中
        $(".myCustomTimeSelect").on("click", "li", function (){
            $(this).addClass("select").siblings().removeClass("select");
            $(".myCustomTimeTileright span").text($(this).text());
            $(".myCustomTimeTileright").removeClass("select");
            $(".myCustomTimeSelect").hide();
        });
        //订阅等级
        $(".myCustomLevelTitleright").on("click", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(".myCustomLevelSelect").show();
            }else {
                $(".myCustomLevelSelect").hide();
            }
        });
        //等级选中
        $(".myCustomLevelSelect").on("click", "li", function (){
            $(this).addClass("select").siblings().removeClass("select");
            $(".myCustomLevelTitleright span").text($(this).text());
            $(".myCustomLevelTitleright").removeClass("select");
            $(".myCustomLevelSelect").hide();
            //改变预警类型
            var typecode   = $(this).data("code");
            var alertli    = $(".myCustomalertList .myCustomalertListli");
            $.each(alertli,function (index,value) {
                var typetext= $(value).find(".typeSpan span").text();
                if(typecode ==1){//接收全部
                    $(value).attr("data-code",1);
                    $(value).find(".typeROYB i").show();
                    $(value).find(".typeSelect ul li").eq(0).addClass("select").siblings().removeClass("select");
                    $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                }else if(typecode ==2){//接收黄色以上
                    $(value).attr("data-code",2);
                    $(value).find(".red,.orange,.yellow").show();
                    $(value).find(".blue").hide();
                    $(value).find(".typeSelect ul li").eq(1).addClass("select").siblings().removeClass("select");
                    $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                }else if(typecode ==3){//接收橙色以上
                    $(value).attr("data-code",3);
                    $(value).find(".red,.orange").show();
                    $(value).find(".yellow,.blue").hide();
                    $(value).find(".typeSelect ul li").eq(2).addClass("select").siblings().removeClass("select");
                    $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                }else if(typecode ==4){//仅红色
                    $(value).attr("data-code",4);
                    $(value).find(".red").show();
                    $(value).find(".orange,.yellow,.blue").hide();
                    $(value).find(".typeSelect ul li").eq(3).addClass("select").siblings().removeClass("select");
                    $(value).find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
                }else if(typecode ==6){//不接收
                    $(value).attr("data-code",6);
                    $(value).find(".typeROYB i").hide();
                    $(value).find(".typeSelect ul li").eq(4).addClass("select").siblings().removeClass("select");
                    $(value).find(".typeImg").attr("src",`images/alarm/${typetext}.png`);
                }
            })
        });
        //点击预警类型按钮
        $(".myCustomalertList").on("click",".myCustomalertListli", function (){ 
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(this).find(".typeSelect").show();
            }else {
                $(this).find(".typeSelect").hide();
            }
            $(".myCustomalertListli").not($(this)).removeClass("select").find(".typeSelect").hide();
        });
        //点击typeSelect中li 改变typeROYB
        $(".myCustomalertList").on("click",".typeSelect ul li", function (e){ 
            e.stopPropagation();
            //订阅等级
            $(".myCustomLevelTitleright span").text("自定义");
            $(".myCustomLevelSelect ul li").eq(4).addClass("select").siblings().removeClass("select");
            //移除父选中
            $(this).parents(".myCustomalertListli").removeClass("select");
            $(this).addClass("select").siblings().removeClass("select");
            var typetext = $(this).parents(".myCustomalertListli").find(".typeSpan span").text();
            var typecode = $(this).data("code");
            if(typecode == 1){//全部
                $(this).parents(".myCustomalertListli").attr("data-code",1);
                $(this).parents(".myCustomalertListli").find(".typeROYB i").show();
                $(this).parents(".myCustomalertListli").find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
            }else if(typecode == 2){//黄色以上
                $(this).parents(".myCustomalertListli").attr("data-code",2);
                $(this).parents(".myCustomalertListli").find(".typeROYB .blue").hide().siblings().show();
                $(this).parents(".myCustomalertListli").find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
            }else if(typecode == 3){//橙色以上
                $(this).parents(".myCustomalertListli").attr("data-code",3);
                $(this).parents(".myCustomalertListli").find(".typeROYB .red,.orange").show();
                $(this).parents(".myCustomalertListli").find(".typeROYB .yellow,.blue").hide();
                $(this).parents(".myCustomalertListli").find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
            }else if(typecode == 4){//仅红色
                $(this).parents(".myCustomalertListli").attr("data-code",4);
                $(this).parents(".myCustomalertListli").find(".typeROYB .red").show().siblings().hide();
                $(this).parents(".myCustomalertListli").find(".typeImg").attr("src",`images/alarm/${typetext+"选中"}.png`);
            }else if(typecode == 5){//不接收
                $(this).parents(".myCustomalertListli").attr("data-code",6);
                $(this).parents(".myCustomalertListli").find(".typeROYB i").hide();
                $(this).parents(".myCustomalertListli").find(".typeImg").attr("src",`images/alarm/${typetext}.png`);
            }
            $(this).parents(".typeSelect").hide();
        });
        //保存方案
        $(".save").on("click",function(){
            //预警地区
            var areali   = $(".tankcontent li");
            var arealist = [];
            $.each(areali,function (index,value) {
                if($(value).hasClass("select")){
                    arealist.push($(value).attr("data-code"));
                }
            });
            //省台
            if(arealist.length==0){
                alert("请选择地区");
                return;
            }
            //订阅时间
            var orderTime  = $(".myCustomTimeSelect").find(".select").attr("data-code");
            //订阅等级
            var orderlevel = $(".myCustomLevelSelect").find(".select").attr("data-code");
            //预警种类
            var  alertli   = $(".myCustomalert .myCustomalertListli");
            var  orderDesc = [];
            $.each(alertli,function (index,value) {
                var levelType        = {};
                levelType.orderlevel = $(value).attr("data-code");
                levelType.signalType = $(value).find(".typeSpan span").text();
                orderDesc.push(levelType);
            })
            console.log(arealist,orderTime,orderlevel,orderDesc);
            proxy.WarningOrder_SaveSXOrderByCode(arealist.join(","),parseInt(orderTime),parseInt(orderlevel),JSON.stringify(orderDesc), function (res) {
            }).then(function(res) {
                $(".time").text(new Date().Format("yyyy-MM-dd hh:mm")+ "已保存");
                localStorage.setItem("myctime",new Date().Format("yyyy-MM-dd hh:mm")+ "已保存");
                alert("保存成功");
            });
        });
    }
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    init();
});