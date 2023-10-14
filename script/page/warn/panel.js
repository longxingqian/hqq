(function (app) {
    var grayImageList={},filterData,allData,yxData,detaildata;
    SW.Rpc.BaseProxy.include({
        ALMT_GetHistoryListByCollectionCodeAndTimes: function (endTime,successFn, errorFn) {
            var params = [];
            params     = params.concat("510100", true,"down", endTime, -1,-1);
            return this.invoke('NewAlmt.GetDataDetailByAreaCodesAndQueryTime', params, 1, successFn, errorFn);
        },
    });
    let almtProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: '/Weather/SWP',
        debug: true
    });
    var name      = getParams("name");
    if(name=="dayun"){
        $(".container").addClass("dayun");
    }else{
        $(".kepubootm").show();
    }
    $(".m-signal-state-effective").addClass("select");
    //初始化
    function init() {
        event();
        let endTime   = new Date();
        almtProxy.ALMT_GetHistoryListByCollectionCodeAndTimes(endTime,function(lres){
            console.log(lres);
            allData    = lres;
            filterData = Object.assign([], allData);
            //状态
            chooseNewPublish(allData);
            //类型
            gettype(allData);
            //有效
            getleft(allData,"成都市");
        })
    }
    //合并预警
    function mergeArray(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i].ID === arr2[j].ID) {
                    arr2.splice(j, 1);
                }
            }
        }
        for (var i = 0; i < arr2.length; i++) {
            arr1.push(arr2[i]);
        }
        return arr1;
    }
    //状态
    function chooseNewPublish(arr) {
        for(let i of arr) {
            if(!i.COUNTY){
                i.COUNTY = i.STATIONNAME;
            }
            if(i.ISSUETIME) {
                let d           = new Date();
                let publishTime = dealTime(i.ISSUETIME);
                publishTime.addHours(i.SIGNALVALIDHOUR);
                if(publishTime < d) {
                    i["CHANGE"] = 4;
                }
            }else{
                i["CHANGE"] = 4;
            }
        }
    }
    //类型
    function gettype(row){
        var typedic={},typearr=[];
        for (var i=0;i<row.length;i++) {
             var model                = row[i];
             typedic[model.SIGNALTYPE]= i;
        }
        for (var number in typedic) {
            var model   = row[typedic[number]];
            typearr.push(model);
        }
        var typehtml =`<li class="select">类型</li>`;
        for (var i=0;i<typearr.length;i++){
            var model= typearr[i];
            typehtml+=`<li>${model.SIGNALTYPE}</li>`
        }
        $(".m-signal-type-select ul").html(typehtml);
    }
    //有效 统计
    function getleft(row,name){
        let youxiao = [];
        for (var i=0;i<row.length;i++) {
            var  model       = row[i];
            var  publishTime = dealTime(model.ISSUETIME);
            publishTime.addHours(model.SIGNALVALIDHOUR);
            if(publishTime < new Date()){
                continue;
            }
            if(name=="成都市"){
                youxiao.push(model);
            }else if(name==model.COUNTY){
                youxiao.push(model);
            }
        }
        if(youxiao.length ==0){
            $(".leftwarn").html("");
            $(".statisticalul").html("");
            return;
        }
        yxData                           = youxiao;
        var dic                          = {};
        var mergearray                   = [];
        for (var i=0;i<yxData.length;i++) {
            var model              = yxData[i];
            dic[model.SIGNALTYPE]  = i;
        }
        for (var number in dic) {
            var model   = yxData[dic[number]];
            mergearray.push(model);
        }
        var lefthtml = "";
        if(mergearray.length>0){
            $(".leftwarn").show();
            lefthtml+=`<li datatype="综合" datalevel="综合">
                            <img src="images/warn/综合-默认.png" alt="">
                            <span>综合</span>
                       </li>`
        }
        for (var i=0;i<mergearray.length;i++) {
            var model= mergearray[i];
            lefthtml+=`<li datatype=${model.SIGNALTYPE} datalevel=${model.SIGNALLEVEL}>
                            <img src="images/warn/${model.SIGNALTYPE}-默认.png" alt="">
                            <span>${model.SIGNALTYPE}</span>
                       </li>`
        }
        $(".leftwarn").html(lefthtml);
        $(".leftwarn li").eq(0).click();
        //统计
        var tonghtml = "";
        for (var i=0;i<mergearray.length;i++) {
            var model    = mergearray[i];
            var blue     = 0;
            var yellow   = 0;
            var orange   = 0;
            var red      = 0;
            for(var j=0;j<yxData.length;j++){
                if(model.SIGNALTYPE == yxData[j].SIGNALTYPE){
                    if (yxData[j].SIGNALLEVEL.indexOf("蓝")>-1) {
                        blue   = blue + 1;
                    }else if (yxData[j].SIGNALLEVEL.indexOf("黄")>-1){
                        yellow = yellow + 1;
                    }else if (yxData[j].SIGNALLEVEL.indexOf("橙")>-1){
                        orange = orange + 1;
                    }else if (yxData[j].SIGNALLEVEL.indexOf("红")>-1){
                        red    = red + 1;
                    }
                }
            }
            tonghtml+= `<li datatype=${model.SIGNALTYPE}>
                            <div datalevel=${model.SIGNALTYPE}>${model.SIGNALTYPE.slice(0,5)}</div>
                            <div datalevel="蓝色">${blue}</div>
                            <div datalevel="黄色">${yellow}</div>
                            <div datalevel="橙色">${orange}</div>
                            <div datalevel="红色">${red}</div>
                        </li>`
        }
        $(".statisticalul").html(tonghtml);
    }
    //时间
    function dealTime(t) {
        let y = t.slice(0,4),
            M = t.slice(4,6),
            d = t.slice(6,8),
            h = t.slice(8,10),
            m = t.slice(10,12),
            s = t.slice(12,14);
        return new Date(`${y}/${M}/${d} ${h}:${m}:${s}`);
    }
    //列表
    function setList(data) {
        var html   = '';
        sortData(data);
        detaildata = data
        data.forEach(function (item) {
            if (item.state != 1) {
                html += ' <div class="m-signal-item" data-type="'+item['SIGNALTYPE']+'" data-level="'+item['SIGNALLEVEL']+'" data-alertid="'+item['ALERTID']+'">\n' +
                    '            <div class="m-signal-image">\n' +
                    '                <img '+ (item['CHANGE'] == 4 && 'class=gray') +' src="images/warnSignal/' + item['SIGNAL'] + '.png"/>\n' +
                    '            </div>\n' +
                    '            <div class="m-signal-title">\n' +
                    '                <span>' +item['COUNTY'] + item['SIGNALTYPE'] + item['SIGNALLEVEL'] + '预警信号' + '</span>\n' +
                    '              <span>' + dealTime(item['ISSUETIME']).Format('yyyy年MM月dd日 hh:mm ')+getState(item['CHANGE'])+'</span>\n' +
                    '            </div>\n'+
                    '   <div class="m-signal-state '+ (item['CHANGE'] == 4 ? 'relieve' : 'effective') +'">\n' +
                    ' '+ (item['CHANGE'] == 4 ? '已解除' : '生效中') +'\n' +
                    '</div>'
            } else {
                html += ' <div class="m-signal-item">\n' +
                    '            <div class="m-signal-image">\n' +
                    '                <img class="gray" src="images/warnSignal/' + item['SIGNAL'] + '.png"/>\n' +
                    '            </div>\n' +
                    '            <div class="m-signal-title">\n' +
                    '                <span>' +item['COUNTY'] + item['SIGNALTYPE'] + item['SIGNALLEVEL'] + '预警信号'  + '</span>\n' +
                    '                <span>' + dealTime(item['ISSUETIME']).Format('yyyy年MM月dd日 hh:mm ')+getState(item['CHANGE'])+'</span>\n' +
                    '            </div>\n'+
                    '   <div class="m-signal-state relieve">\n' +
                    '                已解除' +
                    '            </div>'
            }
            html += '        </div>'
        });
        $('.warnlistul').html(html);
        //默认位置
        var isselect = localStorage.getItem("effective");
        if(isselect == undefined||isselect=="有效"){
            localStorage.setItem("effective","有效");
            $('.m-signal-state-all').removeClass('select');
            $('.m-signal-state-effective').addClass('select');
        }else{
            localStorage.setItem("effective","全部");
            $('.m-signal-state-all').addClass('select');
            $('.m-signal-state-effective').removeClass('select');
        }
        //无数据
        if ($('.m-signal-state-effective').hasClass('select')) {
            $('.relieve').parents('.m-signal-item').hide();
            var ili = $('.effective');
            if(ili.length>0){
                $(".wuimg").hide();
            }else{
                $(".wuimg").show();
            }
        }else{
            if(html==''){
                $(".wuimg").show();
            }else{
                $(".wuimg").hide();
            }
        }
        //灰色图片
        $('img.gray').each(function () {
            (function (img) {
                getGrayImage(img.src, function (data) {
                    $(img).attr("src", data);
                    $(img).removeClass('gray');
                })
            })(this)
        })
    }
    //排序
    function sortData(data) {
        return data.filter(function (item) {
            return item.state != 1
        }).sort(sortFun).concat(data.filter(function (item) {
            return item.state == 1
        }).sort(sortFun));
    };
    //排序
    function sortFun(a, b) {
        return ['红色', '橙色', '黄色', '蓝色'].indexOf(a['SIGNALLEVEL']) - ['红色', '橙色', '黄色', '蓝色'].indexOf(b['SIGNALLEVEL'])
    }
    //灰色图片
    function getGrayImage(path, callback) {
        var data = grayImageList[path];
        if (!data) {
            createGrayImage(path, callback)
        } else {
            callback(data)
        }
    }
    //画图
    function createGrayImage(path, callback) {
        var img = new Image();
        img.src = path;
        //图片加载完成后触发
        img.onload = function () {
            var canvas = document.createElement("canvas");
            //获取绘画上下文
            ctx = canvas.getContext("2d");
            // 获取图片宽高
            var imgWidth = img.width;
            var imgHeight = img.height;
            //设置画布宽高与图片宽高相同
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            //绘制图片
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
            var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgdata.data;
            for (var i = 0, n = data.length; i < n; i += 4) {
                var average = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;
            }
            ctx.putImageData(imgdata, 0, 0);
            //图片展示的 data URI
            var dataUrl = canvas.toDataURL('image/jpeg');
            grayImageList[path] = dataUrl;
            callback ? callback(dataUrl) : '';
        };
    }
    //状态
    function getState(n) {
        switch (parseInt(n)) {
            case 0:{
                return '发布';
            }
            case 1:{
                return '变更';
            }
            case 2:{
                return '继续发布';
            }
            case 3:{
                return '解除';
            }
            case 4:{
                return '已解除';
            }
            default:{
                return '';
            }
        }
    }
    //筛选
    function filter(type, level, area) {
        filterData = allData.filter(function (item) {
            return (!type || item['SIGNALTYPE'] == type) && (!level || item['SIGNALLEVEL'] == level) && (!area || area.indexOf(item['COUNTY']) > -1)
        });
        return filterData;
    }
    //获取区县选中区县
    function getlinedata(area){
        var liarr    =  $('.m-signal-area li');
        $.each(liarr,function (index,value) {
            if (area == $(value).text()) {
                $(value).click();
            }
        });
    }
    //颜色等级
    function getmapData(type,slevel){
        var  level  = [];
        var  blue   = [];
        var  yellow = [];
        var  orange = [];
        var  red    = [];
        if(type == false){//不按类型筛选
            for(var m=0;m<yxData.length;m++){
                var model = yxData[m]
                if (model.SIGNALLEVEL.indexOf("蓝")>-1) {
                    blue.push(model);
                }else if (model.SIGNALLEVEL.indexOf("黄")>-1){
                    yellow.push(model);
                }else if (model.SIGNALLEVEL.indexOf("橙")>-1){
                    orange.push(model);
                }else if (model.SIGNALLEVEL.indexOf("红")>-1){
                    red.push(model);
                }
            }
        }else{//按类型筛选
            for(var m=0;m<yxData.length;m++){
                var model = yxData[m]
                if(type == model.SIGNALTYPE){
                    if (model.SIGNALLEVEL.indexOf("蓝")>-1) {
                        if(slevel == false){
                            blue.push(model);
                        }else{
                            if(slevel == model.SIGNALLEVEL){
                                blue.push(model);
                            }
                        }
                    }else if (model.SIGNALLEVEL.indexOf("黄")>-1){
                        if(slevel == false){
                            yellow.push(model);
                        }else{
                            if(slevel == model.SIGNALLEVEL){
                                yellow.push(model);
                            }
                        }
                    }else if (model.SIGNALLEVEL.indexOf("橙")>-1){
                        if(slevel == false){
                            orange.push(model);
                        }else{
                            if(slevel == model.SIGNALLEVEL){
                                orange.push(model);
                            }
                        }
                    }else if (model.SIGNALLEVEL.indexOf("红")>-1){
                        if(slevel == false){
                            red.push(model);
                        }else{
                            if(slevel == model.SIGNALLEVEL){
                                red.push(model);
                            }
                        }
                    }
                }
            }
        }
        level.push(blue);
        level.push(yellow);
        level.push(orange);
        level.push(red);
        console.log(level);
        app.layer.switchdata(level);
    }
    //监听
    function event() {
        //统计
        $('.statisticalul').on('click',"li div", function () {
            //取消统计选中
            $('.statisticalul').find("li div").removeClass("select");
            $(this).addClass("select").siblings().removeClass("select");
            var type = $(this).parents("li").attr("datatype");
            var level= $(this).attr("datalevel");
            var area = $('.m-signal-area').find("ul li.select").attr("datavalue");
            //左预警
            var liarr    =  $('.leftwarn li');
            $.each(liarr,function (index,value) {
                if (type == $(value).attr("datatype")) {
                    $(value).addClass("select");
                    $(value).find("img").attr("src","images/"+(name=="dayun"?"warnd":"warn")+"/"+$(value).attr("datatype")+"-选中.png");
                }else{
                    $(value).removeClass("select")
                    $(value).find("img").attr("src","images/warn/"+$(value).attr("datatype")+"-默认.png");
                }
            });
            //类型
            var typearr  =  $('.m-signal-type-select li');
            $.each(typearr,function (index,value) {
                if (type == $(value).text()) {
                    $(value).addClass("select");
                    $(".m-signal-type-select-span span").text(type);
                }else{
                    $(value).removeClass("select");
                }
            });
            //等级
            var levelarr =  $('.m-signal-level-select li');
            $.each(levelarr,function (index,value) {
                if(type  == level && index==0){
                    $(value).addClass("select");
                    $(".m-signal-level-select-span span").text("级别");
                }else if (level == $(value).text()) {
                    $(value).addClass("select");
                    $(".m-signal-level-select-span span").text(level);
                }else{
                    $(value).removeClass("select");
                }
            });
            if(type==level){
               level= false;
            }
            setList(filter(type, level, area));
            getmapData(type,level);
        });
        //综合
        $('.leftwarn').on('click',"li", function () {
            //取消统计选中
            $('.statisticalul').find("li div").removeClass("select");
            $(this).addClass("select").siblings().removeClass("select");
            var type     = $(this).attr("datatype");
            var area     = $('.m-signal-area').find("ul li.select").attr("datavalue");
            //左预警
            var liarr    = $('.leftwarn li');
            $.each(liarr,function (index,value) {
                if (type == $(value).attr("datatype")) {
                    $(value).find("img").attr("src","images/"+(name=="dayun"?"warnd":"warn")+"/"+$(value).attr("datatype")+"-选中.png");
                }else{
                    $(value).find("img").attr("src","images/warn/"+$(value).attr("datatype")+"-默认.png");
                }
            });
            //类型
            var typearr  =  $('.m-signal-type-select li');
            $.each(typearr,function (index,value) {
                if(type=="综合" && index==0){
                    $(value).addClass("select");
                    $(".m-signal-type-select-span span").text("类型");
                }else if (type == $(value).text()) {
                    $(value).addClass("select");
                    $(".m-signal-type-select-span span").text(type);
                }else{
                    $(value).removeClass("select");
                }
            });
            //级别
            $('.m-signal-level-select li').eq(0).addClass("select").siblings().removeClass("select");
            $(".m-signal-level-select-span span").text("级别");
            if(type=="综合"){
                type=false;
            }
            setList(filter(type, false, area));
            getmapData(type,false);
        });
        //类型
        $('.m-signal-type-select').on('click', function () {
            $(this).toggleClass('select');
            if($(this).hasClass("select")){
                $(".m-signal-level-select").removeClass("select");
                $(".m-signal-level-select").find("ul").hide();
                $(".m-signal-area").removeClass("select");
                $(".m-signal-area").find("ul").hide();
                $(this).find("ul").show();
            }else{
                $(this).find("ul").hide();
            }
        });
        //类型选择
        $('.m-signal-type-select').on('click',"li", function (e) {
            e.stopPropagation();
            //去掉统计选中
            $('.statisticalul').find("li div").removeClass("select");
            $(".m-signal-type-select").removeClass("select");
            $(".m-signal-type-select").find("span").text($(this).text());
            $(".m-signal-type-select").find("ul").hide();
            $(this).addClass("select").siblings().removeClass("select");
            var type = $('.m-signal-type-select').find("ul li.select").text();
            var level= $('.m-signal-level-select').find("ul li.select").text();
            var area = $('.m-signal-area').find("ul li.select").attr("datavalue");
            if (type == '类型') {
                type  = false;
            }
            if (level == '级别') {
                level = false;
            }
            setList(filter(type, level, area));
        });
        //级别
        $('.m-signal-level-select').on('click', function () {
            $(this).toggleClass('select');
            if($(this).hasClass("select")){
                $(".m-signal-type-select").removeClass("select");
                $(".m-signal-type-select").find("ul").hide();
                $(".m-signal-area").removeClass("select");
                $(".m-signal-area").find("ul").hide();
                $(this).find("ul").show();
            }else{
                $(this).find("ul").hide();
            }
        });
        //级别选择
        $('.m-signal-level-select').on('click',"li",function (e) {
            e.stopPropagation();
            //去掉统计选中
            $('.statisticalul').find("li div").removeClass("select");
            $(".m-signal-level-select").removeClass("select");
            $(".m-signal-level-select").find("span").text($(this).text());
            $(".m-signal-level-select").find("ul").hide();
            $(this).addClass("select").siblings().removeClass("select");
            var type = $('.m-signal-type-select').find("ul li.select").text();
            var level= $('.m-signal-level-select').find("ul li.select").text();
            var area = $('.m-signal-area').find("ul li.select").attr("datavalue");
            if (type == '类型') {
                type  = false;
            }
            if (level == '级别') {
                level = false;
            }
            setList(filter(type, level, area));
        });
        //地区
        $('.m-signal-area').on('click', function () {
            $(this).toggleClass('select');
            if($(this).hasClass("select")){
                $(".m-signal-type-select").removeClass("select");
                $(".m-signal-type-select").find("ul").hide();
                $(".m-signal-level-select").removeClass("select");
                $(".m-signal-level-select").find("ul").hide();
                $(this).find("ul").show();
            }else{
                $(this).find("ul").hide();
            }
        });
        //地区选中
        $('.m-signal-area').on('click',"li", function (e) {
            e.stopPropagation();
            //去掉统计选中
            $('.statisticalul').find("li div").removeClass("select");
            $(".m-signal-area").removeClass("select");
            $(".m-signal-area").find("span").text($(this).text());
            $(".m-signal-area").find("ul").hide();
            $(this).addClass("select").siblings().removeClass("select");
            var type = $('.m-signal-type-select').find("ul li.select").text();
            var level= $('.m-signal-level-select').find("ul li.select").text();
            var area = $('.m-signal-area').find("ul li.select").attr("datavalue");
            if (type == '类型') {
                type  = false;
            }
            if (level == '级别') {
                level = false;
            }
            setList(filter(type, level, area));
            getleft(allData,area?area:"成都市");
        });
        //全部
        $('.m-signal-state-all').on('click', function () {
            //去掉统计选中
            $('.statisticalul').find("li div").removeClass("select");
            localStorage.setItem("effective","全部");
            $(".m-signal-type-select").find("ul").hide();
            $(".m-signal-level-select").find("ul").hide();
            $(".m-signal-area").find("ul").hide();
            $(this).addClass("select").siblings().removeClass("select");
            $('.m-signal-item').show();
            var ili = $('.m-signal-item');
            if(ili.length>0){
                $(".wuimg").hide();
            }else{
                $(".wuimg").show();
            }
        });
        //有效
        $('.m-signal-state-effective').on('click', function () {
            //去掉统计选中
            $('.statisticalul').find("li div").removeClass("select");
            localStorage.setItem("effective","有效");
            $(".m-signal-type-select").find("ul").hide();
            $(".m-signal-level-select").find("ul").hide();
            $(".m-signal-area").find("ul").hide();
            $(this).addClass("select").siblings().removeClass("select");
            $('.relieve').parents('.m-signal-item').hide();
            $('.effective').parents('.m-signal-item').show();
            var ili = $('.effective');
            if(ili.length>0){
                $(".wuimg").hide();
            }else{
                $(".wuimg").show();
            }
        });
        $('.warnlistul').on("click",".m-signal-item",function(){
            localStorage.setItem("selectalmt",JSON.stringify(detaildata[$(this).index()]));
            location.href = "yjxq.html"+(name=="dayun"?"?name=dayun":"");
        });
    }
    function getParams(paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
    app.panel = {
        init: init,
        getlinedata:getlinedata
    }
})(window);