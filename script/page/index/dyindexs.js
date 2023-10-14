$(function(){
    var getStations=[
        {
            "STATIONCODE": "S1003",
            "STATIONLAT": "30.596899",
            "STATIONLON": "104.119138",
            "STATIONNAME":"锦江区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1038",
            "STATIONLAT": "30.689566",
            "STATIONLON": "103.95673",
            "STATIONNAME":"青羊区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1009",
            "STATIONLAT": "30.719327",
            "STATIONLON": "104.040246",
            "STATIONNAME":"金牛区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1007",
            "STATIONLAT": "30.626846",
            "STATIONLON": "103.992671",
            "STATIONNAME":"武侯区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1006",
            "STATIONLAT": "30.701823",
            "STATIONLON": "104.148607",
            "STATIONNAME":"成华区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1726",
            "STATIONLAT": "30.406446",
            "STATIONLON": "104.103893",
            "STATIONNAME":"天府新区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1008",
            "STATIONLAT": "30.556458",
            "STATIONLON": "104.074786",
            "STATIONNAME":"高新南区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1002",
            "STATIONLAT": "30.765223",
            "STATIONLON": "103.917016",
            "STATIONNAME":"高新西区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "S3163",
            "STATIONLAT": "30.356626",
            "STATIONLON": "104.354625",
            "STATIONNAME":"东部新区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56286",
            "STATIONLAT": "30.610955",
            "STATIONLON": "104.293871",
            "STATIONNAME":"龙泉驿区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "S1221",
            "STATIONLAT": "30.804371",
            "STATIONLON": "104.33953",
            "STATIONNAME":"青白江区",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "56290",
            "STATIONLAT": "30.826716",
            "STATIONLON": "104.148236",
            "STATIONNAME":"新都区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56187",
            "STATIONLAT": "30.716428",
            "STATIONLON": "103.840822",
            "STATIONNAME":"温江区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56288",
            "STATIONLAT": "30.525192",
            "STATIONLON": "103.96558",
            "STATIONNAME":"双流区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56272",
            "STATIONLAT": "30.830441",
            "STATIONLON": "103.89672",
            "STATIONNAME":"郫都区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56276",
            "STATIONLAT": "30.431783",
            "STATIONLON": "103.825973",
            "STATIONNAME":"新津区",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56295",
            "STATIONLAT": "30.391089",
            "STATIONLON": "104.658455",
            "STATIONNAME":"简阳市",
            "TYPE":"JPG"
        },
        {
            "STATIONCODE": "56188",
            "STATIONLAT": "31.007742",
            "STATIONLON": "103.657647",
            "STATIONNAME":"都江堰市",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "56189",
            "STATIONLAT": "31.129291",
            "STATIONLON": "103.881075",
            "STATIONNAME":"彭州市",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "56284",
            "STATIONLAT": "30.414686",
            "STATIONLON": "103.36641",
            "STATIONNAME":"邛崃市",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56181",
            "STATIONLAT": "30.699406",
            "STATIONLON": "103.618581",
            "STATIONNAME":"崇州市",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "56296",
            "STATIONLAT": "30.735601",
            "STATIONLON": "104.611935",
            "STATIONNAME":"金堂县",
            "TYPE":"png"
        },
        {
            "STATIONCODE": "56285",
            "STATIONLAT": "30.621651",
            "STATIONLON": "103.438477",
            "STATIONNAME":"大邑县",
            "TYPE":"jpg"
        },
        {
            "STATIONCODE": "56281",
            "STATIONLAT": "30.241766",
            "STATIONLON": "103.481583",
            "STATIONNAME":"蒲江县",
            "TYPE":"jpg"
        }
    ]
    var jingqudata=[
            {
                "id": 1,
                "city": "成都",
                "name": "青城山",
                "lon": 103.578693473959,
                "lat": 30.9035496224572,
                "STATIONCODE": "S1016",
                "TYPE":"jpg"
            },
            {
                "id": 2,
                "city": "成都",
                "name": "都江堰",
                "lon": 103.629298453716,
                "lat": 31.0039984068835,
                "STATIONCODE": "S1083",
                "TYPE":"jpg"
            },
            {
                "id": 3,
                "city": "成都",
                "name": "安仁古镇",
                "lon": 103.625507560261,
                "lat": 30.5154503099786,
                "STATIONCODE": "S1621",
                "TYPE":"png"
            },
            {
                "id": 4,
                "city": "成都",
                "name": "三圣花乡",
                "lon": 104.16237945474,
                "lat": 30.5948803983447,
                "STATIONCODE": "S1003",
                "TYPE":"jpg"
            },
            {
                "id": 5,
                "city": "成都",
                "name": "武侯祠",
                "lon": 104.048483147379,
                "lat": 30.6482828907467,
                "STATIONCODE": "S1185",
                "TYPE":"png"
            },
            {
                "id": 6,
                "city": "成都",
                "name": "杜甫草堂",
                "lon": 104.034976975751,
                "lat": 30.6663336648924,
                "STATIONCODE": "S1145",
                "TYPE":"gif"
            },
            {
                "id": 7,
                "city": "成都",
                "name": "熊猫基地",
                "lon": 104.152275900088,
                "lat": 30.738978841512,
                "STATIONCODE": "S1166",
                "TYPE":"jpg"
            },
            {
                "id": 8,
                "city": "成都",
                "name": "洛带古镇",
                "lon": 103.568597922558,
                "lat": 30.8222541831025,
                "STATIONCODE": "S1033",
                "TYPE":"jpg"
            },
            {
                "id": 9,
                "city": "成都",
                "name": "宝光寺",
                "lon": 104.167043649099,
                "lat": 30.8381929635323,
                "STATIONCODE": "S1405",
                "TYPE":"png"
            },
            {
                "id": 10,
                "city": "成都",
                "name": "黄龙溪",
                "lon": 103.97709258437,
                "lat": 30.323514175214,
                "STATIONCODE": "S1013",
                "TYPE":"png"
            },
            {
                "id": 11,
                "city": "成都",
                "name": "国色天香",
                "lon": 103.960030926982,
                "lat": 30.99841191501,
                "STATIONCODE": 56187,
                "TYPE":"jpg"
            },
            {
                "id": 12,
                "city": "成都",
                "name": "平乐古镇",
                "lon": 103.339106673015,
                "lat": 30.3496177101559,
                "STATIONCODE": "S1030",
                "TYPE":"jpg"
            },
            {
                "id": 13,
                "city": "成都",
                "name": "天台山",
                "lon": 103.861927602552,
                "lat": 31.2455077597595,
                "STATIONCODE": "S1026",
                "TYPE":"jpg"
            },
            {
                "id": 14,
                "city": "成都",
                "name": "金沙遗址",
                "lon": 104.009940221105,
                "lat": 30.6886924632366,
                "STATIONCODE": "S1014",
                "TYPE":"png"
            },
            {
                "id": 15,
                "city": "成都",
                "name": "欢乐谷",
                "lon": 104.040006980006,
                "lat": 30.7272969998559,
                "STATIONCODE": "S1009",
                "TYPE":"jpg"
            },
            {
                "id": 16,
                "city": "成都",
                "name": "街子古镇",
                "lon": 103.567210883217,
                "lat": 30.8202588126012,
                "STATIONCODE": "S1655",
                "TYPE":"png"
            },
            {
                "id": 17,
                "city": "成都",
                "name": "西岭雪山",
                "lon": 103.178111498407,
                "lat": 30.6811453761118,
                "STATIONCODE": "S1606",
                "TYPE":"jpg"
            },
            {
                "id": 18,
                "city": "成都",
                "name": "花水湾",
                "lon": 103.263884851661,
                "lat": 30.564385585241,
                "STATIONCODE": "S1015",
                "TYPE":"jpg"
            },
            {
                "id": 19,
                "city": "成都",
                "name": "花舞人间",
                "lon": 103.81357284569,
                "lat": 30.391988393188,
                "STATIONCODE": 56276,
                "TYPE":"jpg"
            },
            {
                "id": 20,
                "city": "成都",
                "name": "海昌海洋世界",
                "lon": 104.079774883389,
                "lat": 30.5021764298705,
                "STATIONCODE": "S1041",
                "TYPE":"jpg"
            },
            {
                "id": 21,
                "city": "成都",
                "name": "虹口漂流",
                "lon": 103.629658170357,
                "lat": 31.0040492764026,
                "STATIONCODE": "S1290",
                "TYPE":"png"
            },
            {
                "id": 22,
                "city": "成都",
                "name": "非遗博览园",
                "lon": 103.929922104262,
                "lat": 30.6797768040861,
                "STATIONCODE": "S1142",
                "TYPE":"jpg"
            },
            {
                "id": 23,
                "city": "成都",
                "name": "东郊记忆",
                "lon": 104.129416948499,
                "lat": 30.6746599035327,
                "STATIONCODE": "S1161",
                "TYPE":"png"
            },
            {
                "id": 24,
                "city": "成都",
                "name": "三道堰",
                "lon": 103.923754326766,
                "lat": 30.8739443546261,
                "STATIONCODE": "S1302",
                "TYPE":"jpg"
            },
            {
                "id": 25,
                "city": "成都",
                "name": "五凤溪",
                "lon": 104.073005425727,
                "lat": 30.5783196372177,
                "STATIONCODE": "S1455",
                "TYPE":"png"
            },
            {
                "id": 26,
                "city": "成都",
                "name": "宝山",
                "lon": 103.797907628078,
                "lat": 31.2450670316998,
                "STATIONCODE": "S1372",
                "TYPE":"jpg"
            },
            {
                "id": 27,
                "city": "成都",
                "name": "白鹿音乐小镇",
                "lon": 104.139985110519,
                "lat": 30.5781316675836,
                "STATIONCODE": "S1393",
                "TYPE":"png"
            },
            {
                "id": 28,
                "city": "成都",
                "name": "石象湖",
                "lon": 103.431949177685,
                "lat": 30.1991558562185,
                "STATIONCODE": "S1796",
                "TYPE":"jpg"
            },
            {
                "id": 29,
                "city": "成都",
                "name": "元通古镇",
                "lon": 103.568597922558,
                "lat": 30.8222541831025,
                "STATIONCODE": "S1671",
                "TYPE":"jpg"
            },
            {
                "id": 30,
                "city": "成都",
                "name": "海滨城",
                "lon": 103.917149324813,
                "lat": 30.6098057421419,
                "STATIONCODE": 56288,
                "TYPE":"png"
            },
            {
                "id": 31,
                "city": "成都",
                "name": "成佳茶乡",
                "lon": 103.396435853472,
                "lat": 30.2124628567277,
                "STATIONCODE": "S1752",
                "TYPE":"png"
            },
            {
                "id": 32,
                "city": "成都",
                "name": "幸福田园",
                "lon": 103.651822562612,
                "lat": 30.9845247350619,
                "STATIONCODE": "S1707",
                "TYPE":"png"
            },
            {
                "id": 33,
                "city": "成都",
                "name": "青杠树",
                "lon": 103.96181578774,
                "lat": 30.8443982361256,
                "STATIONCODE": "S1301",
                "TYPE":"jpg"
            },
            {
                "id": 34,
                "city": "成都",
                "name": "斑竹林",
                "lon": 103.819156475505,
                "lat": 30.496024651057,
                "STATIONCODE": "S1028",
                "TYPE":"jpg"
            },
            {
                "id": 35,
                "city": "成都",
                "name": "丹景山",
                "lon": 104.224493515012,
                "lat": 30.3798280261473,
                "STATIONCODE": "S1383",
                "TYPE":"png"
            },
            {
                "id": 36,
                "city": "成都",
                "name": "花溪谷",
                "lon": 103.868275443251,
                "lat": 30.6849498543312,
                "STATIONCODE": "S1035",
                "TYPE":"jpg"
            }
    ]
    //变量
    var ALMTdata=[],changguandata;
    // console.log(changguandata);
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
         getLocation();
        $.getJSON("resources/chengdu_changguan.json",function (data) {
            changguandata = data;
            var html="";
            for(var i=0;i<data.length;i++){
                html+=`<li datatype=${data[i].type}>
                         <img src="images/dayun/${data[i].name+"."+data[i].ptype}" alt="">
                         <div>${data[i].name}</div>
                       </li>`
                      
            }
            $(".dayuncontent").html(html);
           
        });
    }
    function addlisten(){
        $(".waring-box").on("click","img",function(res){
            var id = $(this).attr("id");
            var adata;
            for(var i=0;i<ALMTdata.length;i++){
                if(ALMTdata[i].ID == id){
                    adata = ALMTdata[i];
                    break;
                }
               
            }
            // localStorage.setItem()获取指定key本地存储值
            // localStorage.setItem(key,value);将value存储到key字段
            localStorage.setItem("selectalmt",JSON.stringify(adata));
            //跳转
            location.href = "yjxq.html";
        });
        $(".xiala").on("click", function (){
            //切换
            $(this).toggleClass("select");
            //检查是否含有类名
            if($(this).hasClass("select")){
                $(".tk").show()
            }else{
                $(".tk").hide()
            }
        });
        $(".tkcontent").on("click", "li", function (){
            //index索引
            $(".location-bar li").eq($(this).index()).click();
        })
        $(".dayuntitle").on("click","li",function(){
            //siblings同级别
            var index=$(this).attr("dataindex");
            $(this).addClass("select").siblings().removeClass("select");
            var html="";
            if(index==1){
                for(var i=0;i<getStations.length;i++){
                    html+=`<li>
                                <img src="images/shiqu/${getStations[i].STATIONNAME+"."+getStations[i].TYPE}" alt="">
                                <div>${getStations[i].STATIONNAME}</div>
                          </li>`
                }
            }
            if(index==2){
                for(var i=0;i<jingqudata.length;i++){
                    html+=`<li>
                                <img src="images/jingqu/${jingqudata[i].name+"."+jingqudata[i].TYPE}" alt="">
                                <div>${jingqudata[i].name}</div>
                          </li>`
                }
            }
            if(index==3){
                for(var i=0;i<changguandata.length;i++){
                    html+=`<li datatype=${changguandata[i].type}>
                                <img src="images/dayun/${changguandata[i].name+"."+changguandata[i].ptype}" alt="">
                                <div>${changguandata[i].name}</div>
                           </li>`
                }
            }
            $(".dayuncontent").html(html);
        })
        $(".dayuncontent").on("click","li",function(){
            //dataindex那一个分类
            location.href="dydindex.html?dataindex="+$(".dayuntitle").find("li.select").attr("dataindex")+"&name="+$(this).find("div").text()+"&type="+$(this).attr("datatype");
        })
    }
    function getlive(code){
        console.log(code);
        console.log("1")
        $.ajax({
            type:"GET", 
            url:"https://www.cdsqxt.com.cn:8100/Weather/ZDZ?projectname=&calltype=4&iquery=ZDZ.GetDataByStationCodesAndWeatherKeys|1|String;tenminute|String;S1009|String;airtemp_current,wind_current,rh_current,rain_sum|DateTime;2023/10/14%2013:52:27&tk=1697262747471",
            datatype: "json",
            success:function(res){
                res= JSON.parse(res)
                console.log(res);
                if(res.Rows.length>0){
                    $(".temp").text(Math.round(res.Rows[0].AIRTEMP_CURRENT_VALUE));
                    $(".time").text(res.Rows[0].COUNTY+"气象站"+res.Rows[0].HAPPENTIME.slice(11,16)+"采集");
                    $(".rain").text((res.Rows[0].RAIN_SUM_VALUE===null?"/":res.Rows[0].RAIN_SUM_VALUE)+"mm");
                    $(".rh").text((res.Rows[0].RH_CURRENT_VALUE||"/")+"%");
                    $(".wind").text((res.Rows[0].WIND_CURRENT_POWERVALUE||"/")+"级");
                    $(".area span").text(res.Rows[0].CITY+" "+res.Rows[0].COUNTY);
                }
            },   
        });
        zdzProxy.ZDZ_GetDataByStationCodesAndWeatherKeys(code,new Date(),function(res){
            console.log(res);
            // if(res.length>0){
            //     $(".temp").text(Math.round(res[0].AIRTEMP_CURRENT_VALUE));
            //     $(".time").text(res[0].COUNTY+"气象站"+res[0].HAPPENTIME.slice(11,16)+"采集");
            //     $(".rain").text((res[0].RAIN_SUM_VALUE===null?"/":res[0].RAIN_SUM_VALUE)+"mm");
            //     $(".rh").text((res[0].RH_CURRENT_VALUE||"/")+"%");
            //     $(".wind").text((res[0].WIND_CURRENT_POWERVALUE||"/")+"级");
            //     $(".area span").text(res[0].CITY+" "+res[0].COUNTY);
            // }
        })
    }
    function getLocation() {
        AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
                useNative:true,
                enableHighAccuracy: true,//是否使用高度精确定位
                timeout: 5000//超过5s后停止定位
            });
            geolocation.getCurrentPosition();
            //返回定位信息
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);//返回定位出错信息
            function onComplete (data) {
                //data:位置信息
                let lat = data.position.lat, //经度
                    lng = data.position.lng;//维度
                let adr = data.addressComponent;//位置
                var nstation= getNearStation(lng,lat);
                $(".area span").text(adr.city + " " + adr.district);
                $(".street").text(adr.township);
                // if(lng<102.54||lng>104.53||lat<30.05||lat>31.26){
                //     getweek(nstation.STATIONLON,nstation.STATIONLAT);
                // }else{
                //     getweek(lng,lat);
                // }
                getlive(nstation.STATIONCODE);
                getwaring(nstation.STATIONNAME)
            }
            //定位出错
            function onError() {
                var nstation= getNearStation(104.06,30.67);
                // getweek("104.06","30.67");
                getlive(nstation.STATIONCODE);
                getwaring(nstation.STATIONNAME)
            }
        });
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
    function getShowTime(date) {
        var week = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        return week[date.getDay()]; //date.getDate() + "日"
    }
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
    init();
})