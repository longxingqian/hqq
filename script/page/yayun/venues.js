$(function(){
    var lon     = getParams("lon");
    var lat     = getParams("lat");
    var id      = getParams("id");
    var stcode  = "";
    var bodyEN  = $("body").hasClass("EN");
    var public  = $(".venues").hasClass("select");
    var hourdata;
    var hptime;
    SW.Rpc.BaseProxy.include({
        ZDZ_GetDataByStationCodesAndWeatherKeys: function (code,etime,successFn,errorFn) {
            var params = [];
            params     = params.concat("onehour",code,"airtemp_current,wind_current,rh_current,rain_sum_1h",etime);
            return this.invoke('ZDZ.GetDataByStationCodesAndWeatherKeys', params, 1, successFn, errorFn);
        },			
        Stream_GetJxhByTypeCodeAndTimeRangeAndLocation: function (hour,btime,etime,lon,lat,successFn,errorFn) {
            var params = [];
            params     = params.concat("JXH",hour,btime,etime,lon,lat);
            return this.invoke('Stream.GetJxhByTypeCodeAndTimeRangeAndLocation', params, 1, successFn, errorFn);
        },	
    });
    let zdzProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/ZDZ",
        debug: true,
    });
    let nwpProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/NWP",
        debug: true,
    });
    function init(){
        event();
        getchangguan();
        getproducttime();
    }
    function getchangguan(){
        $.getJSON("resources/chengdu_changguan.json",function (data) {
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(id == data[i].id){
                    stcode = data[i].code;
                    $(".venuesname").text(data[i].name);
                    $("body").css({"background-image":`url(${"images/dayun/"+data[i].name+"."+data[i].ptype})`})
                    gethtmlwithkey()
                }
            }
        });
    }
    function gethtmlwithkey(){
        var lhtml1 = "";
        var lhtml2 = "";
        lhtml1+=`<div>
                    <span class="temp">--</span>&nbsp;℃
                </div>
                <div class="weatbox">
                    <img  class="weatimg" src="" alt="">
                    <span class="weat">--</span>
                </div>`
        $(".index-box1").html(lhtml1);
        lhtml2+=`<div>
                    <span class="Precipitation">--</span>
                    <p>${bodyEN?"Precipitation":"过去1h降水"}</p>
                </div>
                ${public?'<div class="line"></div>':""}
                <div>
                    <span class="Humidity">--</span>%
                    <p>${bodyEN?"Humidity":"相对湿度"}</p>
                </div>
                ${public?'<div class="line"></div>':""}
                <div>
                    <span class="WindDirection">--</span>
                    <p>${bodyEN?"Wind Direction":"风向"}</p>
                </div>
                ${public?'<div class="line"></div>':""}
                <div>
                    <span class="WindSpeed">--</span>m/s
                    <p>${bodyEN?"Wind Speed":"风速"}</p>
                </div>`
        $(".index-box2").html(lhtml2);
        var ptoime = new Date();
        ptoime.addMinute(-10);
        zdzProxy.ZDZ_GetDataByStationCodesAndWeatherKeys(stcode,ptoime,function(res){
            console.log(res);
            if(res.length>0){
                var item  = res[0];
                $(".temp").text(yTool.fomatFloat(item.AIRTEMP_CURRENT_VALUE,1)||"--")
                $(".Precipitation").text(item.RAIN_SUM_VALUE!=null?(item.RAIN_SUM_VALUE==0?(bodyEN?"none":"无降水"):item.RAIN_SUM_VALUE+"ml"):"--")
                $(".Humidity").text(item.RH_CURRENT_VALUE||"--")
                $(".WindDirection").text(item.WIND_CURRENT_SPEEDVALUE!=null?(bodyEN?yTool.GetWindDirectionEn(item.WIND_CURRENT_DIRVALUE,item.WIND_CURRENT_SPEEDVALUE):yTool.GetWindDirection(item.WIND_CURRENT_DIRVALUE,item.WIND_CURRENT_SPEEDVALUE)):"--")
                $(".WindSpeed").text(yTool.fomatFloat(item.WIND_CURRENT_SPEEDVALUE,1)||"-")
                $(".toptime").text((bodyEN?"":"更新于")+item.HAPPENTIME);
            }
        })
    }
    function dealTime(t) {
        let y = t.slice(0,4),
            M = t.slice(4,6),
            d = t.slice(6,8),
            h = t.slice(8,10),
            m = t.slice(10,12),
            s = t.slice(12,14);
        return new Date(`${y}/${M}/${d} ${h}:${m}:${s}`);
    }
    //起报时间
    function getproducttime(){
        var btime = new Date();
        var etime = new Date();
        etime.addHours(24);
        nwpProxy.Stream_GetJxhByTypeCodeAndTimeRangeAndLocation(1,btime,etime,lon+"",lat+"",function(res){
            console.log(res[0]);
            hourdata = res[0];
            hptime   = res[0].producttime;
            $(".forecasttime").text((bodyEN?"":"更新于")+hptime);
            initTempChart();
        })
        var btime1 = new Date();
        var etime1 = new Date();
        etime1.addHours(168);
        nwpProxy.Stream_GetJxhByTypeCodeAndTimeRangeAndLocation(24,btime1,etime1,lon+"",lat+"",function(res){
            console.log(res[0]);
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
                    windDir    +="<td>{0}</td>".Format(Tool.GetWindDirection(+item[11], +item[12]));
                    week       +=`<td>${getShowTime(date)}</td>`;
                    dates      +="<td>{0}</td>".Format(date.Format("MM/dd"));
                    let wp1     =Tool.GetWeatherDesc(+item[0]);
                    let wp2     =Tool.GetWeatherDesc(+item[1]);
                    weather1   +=`<td>${wp1 || ""}</td>`;
                    weather2   +=`<td>${wp2 || ""}</td>`;
                    weatherpic1+=`<td>${`<img src='images/weather_img/${wp1?wp1:"NA"}.png'/>`}</td>`;
                    weatherpic2+=`<td>${`<img src='images/weather_img/${wp2?wp2:"NA"}.png'/>`}</td>`;
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
    //公众版24小时
    function initTempChart() {
        let xAxis =[],tempArr =[],weather =[],weather1=[],windSarr=[],windDarr=[];
        if(hourdata.elementlist.length>0){
            for(var i=0;i<hourdata.elementlist.length;i++){
                let eitem = hourdata.elementlist[i].elementvalue;
                tempArr.push(+eitem[1]);
                weather.push(Tool.GetWeatherDesc(parseInt(eitem[0])+""));
                weather1.push(yTool.GetWeatherDescEn (parseInt(eitem[0])+""));
                windDarr.push(+eitem[6]);
                windSarr.push(+eitem[7]);
                var time  = new Date(hptime.replace(/-/g,"/"));
                time.addHours(parseInt(hourdata.elementlist[i].timesession));
                xAxis.push(time.Format("hh:00"));
            }
            let fiveVW = $("body").width() * 0.05;
            let tooltip= `color:#333;
                          font-size:0.24rem;
                          height:0.4rem;
                          display:flex;
                          border-top-left-radius:1rem;
                          border-top-right-radius:1rem;
                          border-bottom-right-radius:1rem;
                          padding:0 .2rem;
                          align-items:center;
                          background-color:#FDD000;
                          position:relative;
                          margin-left:3rem;`;
            let max    = tempArr[0], 
                min    = tempArr[0];
            for (let i of tempArr) {
                if (i > max) {
                    max = i;
                }
                if (i < min) {
                    min = i;
                }
            }
            $(".wind-line, .weather-line, #hoursChart").css("width", (tempArr.length + 1) * (0.95) + "rem");
            min = parseInt(min - (max - min) * 2 / 3);
            max = Math.ceil(max);
            $("#hoursChart").highcharts({
                chart: {
                    type: 'areaspline',
                    backgroundColor: 'rgba(255,255,255,0)',
                    marginBottom: 30,
                    marginLeft: 30,
                    paddingBottom: 20,
                    y: 20,
                    events: {
                        load: function(){
                            var p = this.series[0].points[0];
                            this.tooltip.refresh(p);  
                        }
                    }
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                legend: {
                    selectedMode: false,
                    enabled: false
                },
                xAxis: {
                    lineColor: '#EEEEEE',
                    lineWidth: 1,
                    categories: xAxis,
                    labels: {
                        style: {
                            color: "#999999",
                            fontSize: ".24rem",
                        },
                        y:18,
                    },
                    offset: 10,
                    tickWidth: 0
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    allowDecimals: true,
                    gridLineColor: "#fff",
                    tickPositions: [min, parseInt(min + (max - min) / 2), max + 1],
                    tickAmount: 3,
                    labels: {
                        style: {
                            color: "#666666",
                            fontSize: ".26rem",
                        },
                        formatter: function () {
                            return `<p style="margin-top: 2vw;">${this.value + "℃"}</p>`
                        },
                        useHTML: true,
                    },
                    offset: -20,
                    max: max,
                    min: min
                },
                tooltip: {
                    useHTML: true,
                    enabled: true,
                    shared: false,
                    borderColor: null,
                    borderWidth: 0,
                    padding: 0,
                    positioner: function(w,h,p) {
                        let y = p.plotY;
                        if(p.plotY > 48) {
                            y = y - h - 4;
                        }else{
                            y = y + h + 4;
                        }
                        return {x: p.plotX - w/2 + 8 , y:y};
                    },
                    formatter: function () {
                        let index = this.point.index;
                        var str = `<div style="${tooltip}"><div>${this.x}</div><div style="margin: 0 0.1rem;">${bodyEN?weather1[index]:weather[index]}</div><div>${this.y}℃</div></div>`;
                        return str;
                    }
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.3,
                        dashStyle: "Solid",
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, 'rgba(245, 162, 0, 0.3)'],
                                [1, 'rgba(245, 162, 0, 0)']
                            ]
                        }
                    },
                    lineWidth: 1,
                    series: {
                        marker: {
                            enabled: false,
                        }
                    }
                },
                series: [{
                    name: "",
                    data: tempArr,
                    color: '#F5A200',
                    lineWidth: 1
                }]
            }, function (chart) {
                let windStr    = "";
                let weatherStr = "";
                let nw         = 0;
                chart.series[0].data.forEach(function (point, i) {
                    plotHeight = +$("#hoursChart .highcharts-plot-background").attr("height");
                    let yLine  = $("#hoursChart"),
                        height = yLine.height();
                    let yList  = $("#hoursChart .highcharts-axis-labels.highcharts-yaxis-labels p");
                    var str    = "";
                    yList.each(function () {
                        str    = `<div>${$(this).text()}</div>` + str;
                    });
                        str    = `<div id="windText">${bodyEN?"Wind Scale":"风力"}</div>` + str;
                    $("#hoursChart .highcharts-axis-labels.highcharts-yaxis-labels").hide();
                    $("#yLine").html(str).css({
                        "justifyContent": "space-between",
                        "height": `calc(${height + "px"} - 0.28rem)`,
                    });
                    var x    = point.plotX + chart.plotLeft;
                    let next = chart.series[0].data[i + 1];  
                    let x1;
                    if (next) {
                        x1   = next.plotX + chart.plotLeft
                    }
                    //风向风力
                    windStr += `<div style="left: ${x - fiveVW+11}px">
                                    ${Tool.GetWindLevel(windSarr[i])}${bodyEN?"":"级"}
                                </div>`;
                    //天气气象
                    if (weather[i] === weather[i + 1]){
                        if (nw === 0) {
                            nw += x;
                        }
                    } else {
                        if (nw === 0) {
                            nw += x + x1;
                        } else {
                            nw += x1 ? x1 : x;
                        }
                        if (nw) {
                            let t = parseInt(xAxis[i]);
                            if ((t >= 20 || t <= 8)) {
                                if (weather[i] === "晴" || weather[i] === "阵雨" || weather[i] === "多云") {
                                    weather[i] = weather[i] + "夜";
                                }
                            }
                            weatherStr += `<div style="left: ${nw / 2}px;height: 1rem;">
                                             <img src="images/weatherjianbian/${weather[i]}.png">
                                           </div>`;
                        }
                        nw = 0;
                    }
                });
                $(".wind-list").html(windStr);
                $(".weather-list").html(weatherStr);
            });
        }
    }
    function getShowTime(date) {
        var week   = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        var weekEN = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
        return bodyEN?weekEN[date.getDay()]:week[date.getDay()];
    }
    function setWeekChart(options){
        $('#container').highcharts({
            chart: {
                backgroundColor:"#ffffff",
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
                            // enabled: false
                        }
                    }
                },
                spline: {
                    dataLabels: {
                        formatter: function () {
                            return  Highcharts.numberFormat(this.point.y,0)+ '℃';
                        },
                        enabled: true,
                        color: '#febe30',
                        style: {
                            fontSize:"3vw",
                            fontWeight:"normal",
                            textShadow: 0
                        }
                    },
                    marker: {
                        radius: 4,
                        lineColor: public?'#fff':'',
                        lineWidth: 1
                    },
                    // color:"#ff8400"
                }
            },
            series: [{
                name: "",
                marker: {
                    symbol: 'circle',
                    fillColor:public?"#F5A200":"white"
                },
                data: options.tmax,
                color: public?"#F5A200":"#febe30",
                dataLabels: {
                    color: public?"#333333":"#febe30",
                    verticalAlign: "bottom"
                }
            }, {
                name: "",
                marker: {
                    symbol: 'circle',
                    fillColor:public?"#DF0011":"white"
                },
                data: options.tmin,
                color: public?"#DF0011":"#3b87ef",
                dataLabels: {
                    color: public?"#333333":"#3b87ef",
                    verticalAlign: "top"
                }
            }]
        });
    }
    function event(){
        $("#venuestitle img").on("click",function(){
            window.history.go(-1)
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
    init();
});