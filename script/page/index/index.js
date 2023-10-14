$(function(){
    var getStations=[
        {
            "STATIONCODE": "S1003",
            "STATIONLAT": "30.596899",
            "STATIONLON": "104.119138",
            "STATIONNAME":"锦江"
        },
        {
            "STATIONCODE": "S1038",
            "STATIONLAT": "30.689566",
            "STATIONLON": "103.95673",
            "STATIONNAME":"青羊"
        },
        {
            "STATIONCODE": "S1009",
            "STATIONLAT": "30.719327",
            "STATIONLON": "104.040246",
            "STATIONNAME":"金牛"
        },
        {
            "STATIONCODE": "S1007",
            "STATIONLAT": "30.626846",
            "STATIONLON": "103.992671",
            "STATIONNAME":"武侯"
        },
        {
            "STATIONCODE": "S1006",
            "STATIONLAT": "30.701823",
            "STATIONLON": "104.148607",
            "STATIONNAME":"成华"
        },
        {
            "STATIONCODE": "S1726",
            "STATIONLAT": "30.406446",
            "STATIONLON": "104.103893",
            "STATIONNAME":"天府新区"
        },
        {
            "STATIONCODE": "S1008",
            "STATIONLAT": "30.556458",
            "STATIONLON": "104.074786",
            "STATIONNAME":"高新南区"
        },
        {
            "STATIONCODE": "S1002",
            "STATIONLAT": "30.765223",
            "STATIONLON": "103.917016",
            "STATIONNAME":"高新西区"
        },
        {
            "STATIONCODE": "S3163",
            "STATIONLAT": "30.356626",
            "STATIONLON": "104.354625",
            "STATIONNAME":"东部新区"
        },
        {
            "STATIONCODE": "56286",
            "STATIONLAT": "30.610955",
            "STATIONLON": "104.293871",
            "STATIONNAME":"龙泉驿"
        },
        {
            "STATIONCODE": "S1221",
            "STATIONLAT": "30.804371",
            "STATIONLON": "104.33953",
            "STATIONNAME":"青白江"
        },
        {
            "STATIONCODE": "56290",
            "STATIONLAT": "30.826716",
            "STATIONLON": "104.148236",
            "STATIONNAME":"新都"
        },
        {
            "STATIONCODE": "56187",
            "STATIONLAT": "30.716428",
            "STATIONLON": "103.840822",
            "STATIONNAME":"温江"
        },
        {
            "STATIONCODE": "56288",
            "STATIONLAT": "30.525192",
            "STATIONLON": "103.96558",
            "STATIONNAME":"双流"
        },
        {
            "STATIONCODE": "56272",
            "STATIONLAT": "30.830441",
            "STATIONLON": "103.89672",
            "STATIONNAME":"郫都"
        },
        {
            "STATIONCODE": "56276",
            "STATIONLAT": "30.431783",
            "STATIONLON": "103.825973",
            "STATIONNAME":"新津"
        },
        {
            "STATIONCODE": "56295",
            "STATIONLAT": "30.391089",
            "STATIONLON": "104.658455",
            "STATIONNAME":"简阳"
        },
        {
            "STATIONCODE": "56188",
            "STATIONLAT": "31.007742",
            "STATIONLON": "103.657647",
            "STATIONNAME":"都江堰"
        },
        {
            "STATIONCODE": "56189",
            "STATIONLAT": "31.129291",
            "STATIONLON": "103.881075",
            "STATIONNAME":"彭州"
        },
        {
            "STATIONCODE": "56284",
            "STATIONLAT": "30.414686",
            "STATIONLON": "103.36641",
            "STATIONNAME":"邛崃"
        },
        {
            "STATIONCODE": "56181",
            "STATIONLAT": "30.699406",
            "STATIONLON": "103.618581",
            "STATIONNAME":"崇州"
        },
        {
            "STATIONCODE": "56296",
            "STATIONLAT": "30.735601",
            "STATIONLON": "104.611935",
            "STATIONNAME":"金堂"
        },
        {
            "STATIONCODE": "56285",
            "STATIONLAT": "30.621651",
            "STATIONLON": "103.438477",
            "STATIONNAME":"大邑"
        },
        {
            "STATIONCODE": "56281",
            "STATIONLAT": "30.241766",
            "STATIONLON": "103.481583",
            "STATIONNAME":"蒲江"
        }
    ]
    var  ALMTdata=[];
    SW.Rpc.BaseProxy.include({
        ZDZ_GetRainSumByCollectionCodeAndTimeRange: function (btime,etime,successFn,errorFn) {
            var params = [];
            params     = params.concat("onehour","chengdu_county",btime,etime);
            return this.invoke('ZDZ.GetRainSumByCollectionCodeAndTimeRange', params, 1, successFn, errorFn);
        },
        ZDZ_GetDataByStationCodesAndWeatherKeys: function (code,etime,successFn,errorFn) {
            var params = [];
            params     = params.concat("tenminute",code,"airtemp_current,wind_current,rh_current,rain_sum",etime);
            return this.invoke('ZDZ.GetDataByStationCodesAndWeatherKeys', params, 1, successFn, errorFn);
        },
        Stream_GetJxhByTypeCodeAndTimeRangeAndLocation: function (btime,etime,lon,lat,successFn,errorFn) {
            var params = [];
            params     = params.concat("JXH",24,btime,etime,lon,lat);
            return this.invoke('Stream.GetJxhByTypeCodeAndTimeRangeAndLocation', params, 1, successFn, errorFn);
        },
        ALMT_GetHistoryListByCollectionCodeAndTimes: function (endTime,successFn, errorFn) {
            var params = [];
            params     = params.concat("510100", true,"down", endTime, -1,-1);
            return this.invoke('NewAlmt.GetDataDetailByAreaCodesAndQueryTime', params, 1, successFn, errorFn);
        },					
    });
    let almtProxy = new SW.Rpc.BaseProxy({
        rootURL:'https://www.cdsqxt.com.cn:8100',
        serviceUrl: '/Weather/SWP',
        debug: true
    });
    let zdzProxy = new SW.Rpc.BaseProxy({
        rootURL:'https://www.cdsqxt.com.cn:8100',
        serviceUrl: "/Weather/ZDZ",
        debug: true,
    });
    let nwpProxy = new SW.Rpc.BaseProxy({
        rootURL:'https://www.cdsqxt.com.cn:8100',
        serviceUrl: "/Weather/NWP",
        debug: true,
    });
    function init(){
        addlisten();
        gettk();
        $(".location-bar li").eq(0).click();
    }
    function gettk(){
        var html=`  <li>
                        <img src="images/index/pst.png" alt="">
                        <span>定位</span>
                    </li>`
        for(var i=0;i<getStations.length;i++){
            html+=` <li>
                        <img src="images/index/pst.png" alt="">
                        <span>${getStations[i].STATIONNAME}</span>
                    </li>`
        }
        $(".tkcontent").html(html);
    }
    function addlisten(){
        $(".location-bar").on("click", "li", function (){
            $(this).addClass("select").siblings().removeClass("select");
            var code=$(this).attr("datacode");
            var lon =$(this).attr("datalon");
            var lat =$(this).attr("datalat");
            $(".area span").text($(this).find("span").text());
            $(".xiala").removeClass("select");
            $(".tk").hide()
            $(".tkcontent li").eq($(this).index()).addClass("select").siblings().removeClass("select");
            if(code.length>0){
                $(".street").hide();
                getlive(code);
                getweek(lon,lat);
                getwaring($(this).find("span").text())
            }else{
                $(".street").show();
                getLocation();
            }
        });
        $(".waring-box").on("click","img",function(res){
            var id = $(this).attr("id");
            var adata;
            for(var i=0;i<ALMTdata.length;i++){
                if(ALMTdata[i].ID == id){
                    adata = ALMTdata[i];
                    break;
                }
            }
            localStorage.setItem("selectalmt",JSON.stringify(adata));
            location.href = "yjxq.html";
        });
        $(".xiala").on("click", function (){
            $(this).toggleClass("select");
            if($(this).hasClass("select")){
                $(".tk").show()
            }else{
                $(".tk").hide()
            }
        });
        $(".tkcontent").on("click", "li", function (){
            $(".location-bar li").eq($(this).index()).click();
        })
    }
    function getlive(code){
        console.log(code);
        zdzProxy.ZDZ_GetDataByStationCodesAndWeatherKeys(code,new Date(),function(res){
            console.log(res);
            if(res.length>0){
                $(".temp").text(Math.round(res[0].AIRTEMP_CURRENT_VALUE));
                $(".time").text(res[0].COUNTY+"气象站"+res[0].HAPPENTIME.slice(11,16)+"采集");
                $(".rain").text((res[0].RAIN_SUM_VALUE===null?"/":res[0].RAIN_SUM_VALUE)+"mm");
                $(".rh").text((res[0].RH_CURRENT_VALUE||"/")+"%");
                $(".wind").text((res[0].WIND_CURRENT_POWERVALUE||"/")+"级");
                $(".area span").text(res[0].COUNTY);
                // $(".street").text(res[0].TOWN);
            }
        })
    }
    function getweek(lon,lat){
        var dateTime = new Date();
        var hour = dateTime.getHours();
        if(hour>20){
            dateTime.setHours(20, 0, 0);
        }else if(hour>8){
            dateTime.setHours(8, 0, 0);
        }else{
            dateTime.setHours(20, 0, 0);
            dateTime.addDays(-1);
        }
        var btime = new Date(dateTime);
        var etime = new Date(dateTime);
        etime.addHours(168);
        nwpProxy.Stream_GetJxhByTypeCodeAndTimeRangeAndLocation(btime,etime,lon+"",lat+"",function(res){
            console.log(res);
            if(res[0].elementlist.length>0){
                let categories  =[],
                    tempHighData=[],
                    templowData =[],
                    week='',
                    dates='',
                    windLevel='',
                    windDir='',
                    weather1='',
                    weather2='',
                    weatherpic1='',
                    weatherpic2='';
                let date = new Date();
                for(var i=0;i<7;i++){
                    categories.push(date.Format('dd日'));
                    let item = res[0].elementlist[i].elementvalue;
                    tempHighData.push(item[2] === "999.9" ? null : Math.round(+item[2]));
                    templowData.push(item[3] === "999.9" ? null : Math.round(+item[3]));
                    windLevel  +="<td>{0}</td>".Format(Tool.GetWindLevel(+item[12]) + "级");
                    windDir    +="<td>{0}</td>".Format(myGetWindEightDirection(+item[11], +item[12]));
                    week       +=`<td>${getShowTime(date)}</td>`;
                    dates      +="<td>{0}</td>".Format(date.Format("MM/dd"));
                    let wp1     =Tool.GetWeather(+item[0]);
                    let wp2     =Tool.GetWeather(+item[1]);
                    weather1   +=`<td>${wp1 || ""}</td>`;
                    weather2   +=`<td>${wp2 || ""}</td>`;
                    weatherpic1+=`<td>${`<img src='images/weather_img75/${wp1?wp1:"NA"}.png'/>`}</td>`;
                    weatherpic2+=`<td>${`<img src='images/weather_img75/${wp2?wp2:"NA"}.png'/>`}</td>`;
                    date.addDays(1);
                }
                $('.i-air').html(weather1);
                $('.i-airB').html(weather2);
                $(".i-weeks").html(week);
                $(".i-tr").html(dates);
                $(".i-tr3").html(windDir);
                $(".i-tr4").html(windLevel);
                $('.i-airImg').html(weatherpic1);
                $('.i-airImg01').html(weatherpic2);
                setWeekChart({
                    tmax:tempHighData,
                    tmin:templowData,
                    categories:categories
                })
            }
        })
    }
    //时间
    function getShowTime(date) {
        var week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        return week[date.getDay()]; //date.getDate() + "日"
    }
    //一周曲线
    function setWeekChart(options){
        $('#container').highcharts({
            chart: {
                backgroundColor:"rgba(255,255,255,0)",
                type: 'spline',
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            legend: {
                selectedMode:false,
                enabled: false
            },
            xAxis: {
                title: {
                    text: ''
                },
                lineWidth :0,
                tickWidth:0,
                labels:{
                    enabled:false
                }
            },
            yAxis: {
                labels:{
                    enabled:false
                },
                title:{
                    enabled:false
                },
                enabled:false,
                visible:false,
                gridLineWidth:'0'
            },
            tooltip: {
                enabled:false,
                show:false,
                crosshairs: false,
                shared: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    lineWidth:2,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                spline: {
                    dataLabels: {
                        enabled: true,
                        color: '#febe30',
                        style: {
                            fontSize:"3vw",
                            fontWeight:"normal",
                            textShadow: 0,
                            textOutline:"none"
                        }
                    },
                    marker: {
                        radius: 4,
                        lineColor: '',
                        lineWidth: 1
                    },
                    // color:"#ff8400"
                }
            },
            series: [{
                name: "",
                marker: {
                    symbol: 'circle',
                    fillColor:"#578EDB"
                },
                data: options.tmax,
                color: "#FFE400",
                dataLabels: {
                    color: "#FFE400",
                    verticalAlign: "bottom"
                }
            }, {
                name: "",
                marker: {
                    symbol: 'circle',
                    fillColor:"#5487D7"
                },
                data: options.tmin,
                color: "#00FCFF",
                dataLabels: {
                    color: "#00FCFF",
                    verticalAlign: "top"
                }
            }]
        });
    }
    //风
    function myGetWindEightDirection(dir, speed){
        var retString = "";
        if (speed == 0) {
            retString = "静风";
        }
        else {
            var grade = 0;
            var val = parseFloat(dir) + 11.25;
            if (val < 360) {
                grade = parseInt(Math.floor(val / 22.5));
            }
            else {
                grade = 0;
            }
            switch (grade) {
                case 0:{
                    retString = "北风";
                }break;
                case 1:
                case 2:
                case 3:{
                    retString = "东北风";
                }break;
                case 4:{
                    retString = "东风";
                }break;
                case 5:
                case 6:
                case 7:{
                    retString = "东南风";
                }break;
                case 8:{
                    retString = "南风";
                }break;
                case 9:
                case 10:
                case 11:{
                    retString = "西南风";
                }break;
                case 12:{
                    retString = "西风";
                }break;
                case 13:
                case 14:
                case 15:{
                    retString = "西北风";
                }break;
                default:break;
            }
        }
        return retString;
    }
    function getLocation() {
        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                useNative:true,
                enableHighAccuracy: true,
                timeout: 5000
            });
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);
            AMap.event.addListener(geolocation, 'error', onError);
            function onComplete (data) {
                let lat = data.position.lat, 
                    lng = data.position.lng;
                let adr = data.addressComponent;
                var nstation= getNearStation(lng,lat);
                $(".area span").text(adr.city + " " + adr.district);
                $(".street").text(adr.township);
                if(lng<102.54||lng>104.53||lat<30.05||lat>31.26){
                    getweek(nstation.STATIONLON,nstation.STATIONLAT);
                }else{
                    getweek(lng,lat);
                }
                getlive(nstation.STATIONCODE);
                getwaring(nstation.STATIONNAME)
            }
            function onError() {
                var nstation= getNearStation(104.06,30.67);
                getweek("104.06","30.67");
                getlive(nstation.STATIONCODE);
                getwaring(nstation.STATIONNAME)
            }
        });
    }
    function getNearStation(lng,lat){
        var nd     = getStations[0];
        for (var i = 1; i < getStations.length; i++) {
            var y  = getStations[i].STATIONLAT,
                x  = getStations[i].STATIONLON,
                y0 = nd.STATIONLAT,
                x0 = nd.STATIONLON;
            if ((Math.pow((y - lat), 2) + Math.pow((x - lng), 2)) < (Math.pow((y0 - lat), 2) + Math.pow((x0 - lng), 2))){
                nd = getStations[i];
            }
        }
        return nd;
    }
    function getwaring(name){
        almtProxy.ALMT_GetHistoryListByCollectionCodeAndTimes(new Date(),function(lres){
            console.log(lres);
            ALMTdata = lres;
            var html = ""
            for(var i=0;i<lres.length;i++){
                if(lres[i].COUNTY.indexOf(name)>-1){
                    html+=`<img  id="${lres[i]['ID']}" src="images/warnSignal/${lres[i]['SIGNAL']}.png"/>`
                }
            }
            $(".waring-box").html(html);
        })
    }
    init();
})