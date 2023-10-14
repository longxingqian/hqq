(function (app) {
    let tileLayer = {},gisdata=[],baseLayers,playAgent,radLayer,mode,gridModel,glLayer;
    let pstyle    = {weight: 1, color: '#373f52', stroke: true, opacity: 1, fillColor: '#fff', fillOpacity: 0};
    let pstyle1   = {weight: 2, color: '#373f52', stroke: true, opacity: 1, fillColor: '#fff', fillOpacity: 0};
    var radLegend = [
        {color:'#0200f3',value:-5 }, 
        {color:'#0199ec',value:0 },
        {color:'#00ebeb',value:5 },
        {color:'#00ff00',value:10 },
        {color:'#02c200',value:15}, 
        {color:'#018400',value:20},
        {color:'#fffa00',value:25}, 
        {color:'#e8b800',value:30},
        {color:'#ff8600',value:35}, 
        {color:'#fb0200',value:40},
        {color:'#c70100',value:45}, 
        {color:'#980002',value:50},
        {color:'#ff00fe',value:55}, 
        {color:'#a586ed',value:60},
        {color:'#ffffff',value:65}
    ];
    SW.Rpc.BaseProxy.include({
        RAD_GetDataListByTypeCodesAndTimes: function (time,successFn,errorFn) {
            var params = [];
            params     = params.concat("MCR_RADDATA2_P","F2DCR_RADDATA2_P",time,6,120,-1,-1);
            return this.invoke('RAD.GetDataListByTypeCodesAndTimes', params, 3, successFn, errorFn);
        },
        REDIS_GetDataContentByRedisKey: function (code,successFn,errorFn) {
            var params = [];
            params     = params.concat(code);
            return this.invoke('REDIS.GetDataContentByRedisKey', params, 1, successFn, errorFn);
        },
        REDIS_GetDataContentByRedisKey1: function (code,successFn,errorFn) {
            var params = [];
            params     = params.concat(code,"int16");
            return this.invoke('REDIS.GetDataContentByRedisKey', params, 5, successFn, errorFn);
        }
    });
    let radProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/RAD",
        debug: true,
    });
    let dbProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        returntype: 1,
        serviceUrl: '/DB',
        ws: SW.ws_Promise(),
        debug: true,
    });
    let dbProxy1 = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: '/DB',
        debug: true,
    });
    function init() {
        event();
        setTiles();
        switchLayer("xz","xz");
        let baseSize = parseInt($("html")[0].style.fontSize);
        baseLayers   = {
            cityLine: L.geoJson(global.resources.cityLine,{
                style: pstyle1,
                pane: 'boundaryPane', 
                interactive: false
            }),
            countyLine: L.geoJson(global.resources.countyLine,{
                style: pstyle,
                pane: 'boundaryPane', 
                interactive: false
            }),
            countyName: new LW.LabelLayer({nameField:"name",locationField:"location",iconOptions:{
                iconSize: new L.Point( baseSize*2, baseSize*0.24),
                color: '#333',
                fontSize: baseSize*0.05+'px',
                bold: false,
                borderColor:'#fff'
            }}).setData(global.resources.countyName),
        };
        baseLayers.cityLine.addTo(map);
        baseLayers.countyLine.addTo(map);
        map.fitBounds(baseLayers.cityLine.getBounds());
        //雷达
        radLayer = LW.radarLayer('', null, { pixelate: true, legendData: radLegend, pane: "shadowPane" });
        radLayer.filterColor = "#00ff00";// 10以上
        map.addLayer(radLayer);
        renderLegend(radLegend,"Dbz");
        addplayAgent();
        getradar();
        //格点
        var mask     = LW.maskGeoJson(global.resources.cityLine).addTo(map);
        gridModel = new LW.GridModel({dataType: 'gridInt'});
        glLayer   = LW.gradientGlLayer(gridModel,{
            legendData:Sun.LegendData.rain,
            opacity:0.6,
            gridOptions:{
                zooms:[5,15],
                font:'14px Microsoft YaHei',
                valueColor:'#fff',
                valueStroke:'#222',
                gridWindStroke:'#fff',
            },
            maskGeoJson: mask
        });
        map.addLayer(glLayer);
        getele();
    }
    function getele(){
        let str = "";
        for(let i of config.ele) {
            str += `<div class="item"><img src="images/radar/${i.imgname}.png" alt="">${i.name}</div>`;
            str += `<ul>`;
            for(let item of i.children) {
                str+=`<li data-hour="${item.hour}" data-val="${item.val}" data-legend="${i.legend}" data-unit="${i.unit}">${item.name}</li>`;
            }
            str += `</ul>`
        }
        $(".layer-box,.ele-list,.data-box").show();
        $("#eleList").html(str);
        $("#eleList li").eq(0).click();
    }
    //地图
    function setTiles(){
        var ops = config.map.mapUrl;
        for (var key in ops) {
            tileLayer[key] = L.layerGroup();
            var data = ops[key].data || [],
                len  = data.length;
            for (var i = 0; i < len; i++) {
                L.tileLayer(data[i].url, data[i].options || {}).addTo(tileLayer[key]);
            }
        }
    }
    //选择地图
    function switchLayer(oldTile, newTile) {
        map.removeLayer(tileLayer[oldTile]);
        map.addLayer(tileLayer[newTile]);
    }
    //图列
    function renderLegend(data, unit) {
        let str = "";
        for(var index=data.length-1;index>=0;index--) {
            var item = data[index];
            str += `<li>
                        <div style="background:${item.color}"></div>
                        <span>${item.value}</span>
                    </li>`;
        }
        $("#legend ul").html(str);
        $("#legend>div").html(unit);
    }
    //播放器
    function addplayAgent(){
        playAgent = new LW.ImagePlayerAgent({
            showFun: setRadarImage
        });
    }
    function setRadarImage(item) {
        radLayer.setBounds([[item.MINLAT, item.MINLON], [item.MAXLAT, item.MAXLON]]);
        radLayer.setUrl(item.FILEPATH);
        $(".title1").html(new Date(item.PRODUCTTIME.replace(/-/g, '/')).Format("yyyy-MM-dd hh:mm ")+"<span>雷达回波</span>");
        console.log(item,Number(playAgent.cursor));
        var liarr = $("#timeul li");
        $.each(liarr,function (vindex,value) {
            if (item.ID == $(value).attr("datatid")) {
                $(value).addClass("select");
            }else{
                $(value).removeClass("select");
            }
        });
    }
    //雷达数据
    function getradar(){
        radProxy.RAD_GetDataListByTypeCodesAndTimes(new Date(),function(res){
            console.log(res);
            if(res.length>0){
                res.shift();
                gettime(res.reverse());
            }
        })
    }
    function gettime(res){
        gisdata  = res;
        var html = "";
        for(var g=5;g>0;g--){
            html+=`<div>
                      <div class="timetop">${new Date(res[g*4-1].PRODUCTTIME.replace(/-/g, "/")).Format("hh:mm")}</div>
                      <div class="timebottom">
                           ${getli(res,(g-1)*4,g*4)}
                      </div>
                   </div>`
        }
        $(".time").html(html);
        playAgent.setData(res);
        playAgent.showFirst();
        showLayer(radLayer, true);
    }
    function getli(res,min,max){
        var lihtml= "";
        for(var i = max-1; i>=0; i--){
            if(i>=min){
               lihtml+=`<li datatid=${res[i].ID} datasrc=${res[i].FILEPATH}></li>`
            }
        }
        return lihtml;
    }
    function showLayer(layer, checked) {
        if(!checked && map.hasLayer(layer)){
            map.removeLayer(layer);
        }else if(checked && !map.hasLayer(layer)){
            map.addLayer(layer);
        }
    }
    //站点名 站点值
    function setZdzLayerOption(type, check) {
        glLayer.setGridElementVisible("value", check);
    }
    //填色
    function setContourFill(check) {
        showLayer(glLayer, check);
        // glLayer.setFillVisible( check);
    }
    function setname(checked){
        showLayer(baseLayers.countyName, checked)
    }
    //格点数据
    function getmodedata(hour,val,key){
        var time = mode.ProductDateTime[mode.ProductDateTime.length-1];
        if(time.length){
            var code = mode.KeyMode.replace(/{ele}/g, val).replace(/{yyyyMMddHH}/g, time).replace(/{aaa}/g, 0+hour);
            dbProxy.REDIS_GetDataContentByRedisKey1(code, function (res) {
            }).then(function(res) {
                // var gridIntReader = new Sun.GridInt16Reader();
                // var data          = gridIntReader.readData(res);
                // console.log(data.ProductDateTime);
                $(".title2").html(new Date().Format("yyyy-MM-dd hh:mm ")+"<span>"+$(".wind span").text()+"</span>");
                if(key=="wind"){
                    glLayer.options.gridOptions.elements       =['value','wind'];
                    glLayer.options.gridOptions.elementsVisible={value:true,wind:true};
                    gridModel.options.wind = true
                    gridModel.options.dataSpeed = true
                    
                }else{
                    glLayer.options.gridOptions.elements       =['value'];
                    glLayer.options.gridOptions.elementsVisible={value:true,wind:false};
                    gridModel.options.wind = false
                    gridModel.options.dataSpeed = false
                }
                glLayer.setLegendData(Sun.LegendData[key]);
                gridModel.setData(res);
                glLayer.setGridElementVisible("value", true);
            });
        }else{//清空格点

        }
    }
    function event(){
        $(".radar").click(function () {
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $("#timeul").show();
                getradar();
                $(this).find("img").attr("src","images/radar/雷达选中.png")
            }else{
                $("#timeul").hide();
                $(this).find("img").attr("src","images/radar/雷达.png")
                showLayer(radLayer, false);
            }
        });
        $("#timeul").on("click","li",function(){
            $("#timeul img").removeClass("stop");
            $("#timeul img").attr("src","images/radar/play.png")
            playAgent.stop();
            var item;
            for(var i=0;i<gisdata.length;i++){
                if(gisdata[i].ID == $(this).attr("datatid")){
                    item = i;
                }
            }
            playAgent.setItem(item);
        })
        $("#timeul img").on("click",function(){
            $(this).toggleClass("stop");
            if($(this).hasClass("stop")){
                $(this).attr("src","images/radar/stop.png")
                playAgent.play();
            }else{
                $(this).attr("src","images/radar/play.png")
                playAgent.stop();
            }
        })
        $(".tile-box").on("click","li",function(){   
            if($(this).hasClass("active")) {
                return false;
            }
            let oldTile = $(this).siblings(".active").data("type");
            let newTile = $(this).data("type");
            $(this).addClass("active").siblings().removeClass("active");
            switchLayer(oldTile, newTile);
        })
        $(".layer").on("click",function(){
            app.vuePage.layerShow = true;
        });
        $("#closeLayer").click(function () {
            app.vuePage.layerShow = false;
        });
        $("#closeChart").click(function () {
            app.vuePage.chartShow = false;
        });
        $(".wind").on("click",function(){
            app.vuePage.eleShow = true;
        });
        $("#closeEle").click(function () {
            app.vuePage.eleShow = false;
        });
        //预报
        $("#eleList").on("click", "li", function () {
            $("#eleList").find("li").removeClass("active");
            $(this).addClass("active");
            var hour   = $(this).attr("data-hour");
            var val    = $(this).attr("data-val");
            var legend = $(this).attr("data-legend");
            var unit   = $(this).attr("data-unit");
            app.vuePage.eleShow = false;
            $(".wind span").text($(this).text());
            dbProxy1.REDIS_GetDataContentByRedisKey("b_j_background_key_list",function(res){
                for(var i=0;i<res.length;i++){
                    if(res[i].ForecastID == "scmoc"){
                        mode = res[i];
                        getmodedata(hour,val,legend);
                    }
                }
            })
        });
    }
    app.layer = {
        init: init,
        setZdzLayerOption:setZdzLayerOption,
        setContourFill:setContourFill,
        setname:setname
    }
})(window);