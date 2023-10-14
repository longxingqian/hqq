var Tool = new Object();
Tool.Version = function () {
    return "1.0.1";
};
//获取时间
Tool.getDate = function () {
    var d = new Date();
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    var vDay = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var se = d.getSeconds();
    s = vYear + "-" + (vMon < 10 ? "0" + vMon : vMon) + "-" + (vDay < 10 ? "0" + vDay : vDay) + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (se < 10 ? "0" + se : se);
    return s;
};
//获取服务器时间
Tool.getServerDate = function () {
    var date = new Date($.ajax({ async: false }).getResponseHeader("Date"));
    var bombay = date + (3600000 * 8);
    var time = new Date(bombay);
    return time;
};
//获取链接参数
Tool.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r =ow.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};
//清空本地存储
Tool.clearStorage = function (json) {
    json = eval(json);
    for (var key in json) {
        storage[json[key].name] = "";
    }
};

//调用方法
Tool.callFun = function (json) {
    var func = function () { };
    json = eval(json);
    for (var key in json) {
        try {
            func = new Function(json[key].name + "();");
            func();
        } catch (e) {
            console.log(json[key].name + "()不存在！");
        }
    }
};
//浅克隆
Tool.shallowClone = function (obj) {
    var clone = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            clone[p] = obj[p];
        }
    }
    return clone;
};

Tool.GetElementUnitTitle = function(el,isBr){
    isBr = isBr?isBr:true;
    var unit="";
    switch(el){
        case "降水":
        case "降水量":{
            unit = (isBr?"</br>":"")+"(mm)";
            break;
        }
        case "相对湿度":
        case "云量":{
            unit = (isBr?"</br>":"")+"(%)";
            break;
        }
        case "温度":
        case "最高温":
        case "最高气温":
        case "最低温":
        case "最低气温":{
            unit = (isBr?"</br>":"")+"(℃)";
            break;
        }
        case "能见度":{
            unit = (isBr?"</br>":"")+"(km)";
            break;
        }
        case "风速":{
            unit = (isBr?"</br>":"")+"(m/s)";
            break;
        }
        case "风力":{
            unit = (isBr?"</br>":"")+"(级)";
            break;
        }
        default:{
            unit = "";
            break;
        }
    }
    return el+unit;
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Array.prototype.clone = function(){//为数组添加克隆自身方法，使用递归可用于多级数组
    var newArr = new Array();
    for(var i=0;i<=this.length-1;i++)
    {
        var itemi=this[i];
        if(itemi.length && itemi.push) itemi= itemi.clone();//数组对象，进行递归
        else if(typeof(itemi)=="object") itemi=objClone(itemi);//非数组对象，用上面的objClone方法克隆
        newArr.push(itemi);
    }
    return newArr;
};
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

function objClone(myObj){
    if(typeof(myObj) != 'object') return myObj;
    if(myObj == null) return myObj;
    var myNewObj = new Object();
    for(var i in myObj)
        myNewObj[i] = objClone(myObj[i]);
    return myNewObj;
}

//计算风向
Tool.GetWindDirection = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "静风";
    }
    else {
        var grade = 0;
        var val = parseFloat(dir) + 11.25;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 22.5));
            if(grade%2==1) grade=grade-1;
        }
        else {
            grade = 0;
        }
        switch (grade) {
            case 0:
                retString = "北";
                break;
            case 1:
                retString = "东北偏北";
                break;
            case 2:
                retString = "东北";
                break;
            case 3:
                retString = "东北偏东";
                break;
            case 4:
                retString = "东";
                break;
            case 5:
                retString = "东南偏东";
                break;
            case 6:
                retString = "东南";
                break;
            case 7:
                retString = "东南偏南";
                break;
            case 8:
                retString = "南";
                break;
            case 9:
                retString = "西南偏南";
                break;
            case 10:
                retString = "西南";
                break;
            case 11:
                retString = "西南偏西";
                break;
            case 12:
                retString = "西";
                break;
            case 13:
                retString = "西北偏西";
                break;
            case 14:
                retString = "西北";
                break;
            case 15:
                retString = "西北偏北";
                break;
        }
    }
    return retString;
};
//计算风向
Tool.GetWindDirectionEn = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "no wind";
    }
    else {
        var grade = 0;
        var val = parseFloat(dir) + 11.25;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 22.5));
            // if(grade%2==1) grade=grade-1;
        }
        else {
            grade = 0;
        }
        switch (grade) {
            case 0:
                retString = "North";
                break;
            case 1:
                retString = "东北偏北";
                break;
            case 2:
                retString = "northeast";
                break;
            case 3:
                retString = "东北偏东";
                break;
            case 4:
                retString = "East";
                break;
            case 5:
                retString = "东南偏东";
                break;
            case 6:
                retString = "Southeast";
                break;
            case 7:
                retString = "东南偏南";
                break;
            case 8:
                retString = "South";
                break;
            case 9:
                retString = "西南偏南";
                break;
            case 10:
                retString = "southwest";
                break;
            case 11:
                retString = "西南偏西";
                break;
            case 12:
                retString = "west";
                break;
            case 13:
                retString = "西北偏西";
                break;
            case 14:
            case 15:
                retString = "northwest";
                break;
            case 15:
                retString = "西北偏北";
                break;
        }
    }
    return retString;
};
//计算8个风向
Tool.GetWindDirection8 = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "静风";
    }
    else {
        var grade = 0;
        var val = parseFloat(dir) + 22.5;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 45));
                       // if(grade%2==1) grade=grade-1;
        }
        else {
            grade = 0;
        }
        switch (grade) {
            case 0:
                retString = "北风";
                break;

            case 1:
                retString = "东北风";
                break;

            case 2:
                retString = "东风";
                break;

            case 3:
                retString = "东南风";
                break;

            case 4:
                retString = "南风";
                break;

            case 5:
                retString = "西南风";
                break;

            case 6:
                retString = "西风";
                break;

            case 7:
                retString = "西北风";
                break;
        }
    }

    return retString;
};

Tool.GetWindEightDirectionCode = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "-1";
    } else {
        var grade = 0;
        var val = parseFloat(dir) + 22.5;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 45));
        }
        else {
            grade = 0;
        }
        retString = grade;
    }
    return retString;
};
Tool.GetWindDirection8En = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "no wind";
    }
    else {
        var grade = 0;
        var val = parseFloat(dir) + 22.5;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 45));
            // if(grade%2==1) grade=grade-1;
        }
        else {
            grade = 0;
        }
        switch (grade) {
            case 0:
                retString = "N";
                break;

            case 1:
                retString = "NE";
                break;

            case 2:
                retString = "E";
                break;

            case 3:
                retString = "SE";
                break;

            case 4:
                retString = "S";
                break;

            case 5:
                retString = "SW";
                break;

            case 6:
                retString = "W";
                break;


            case 7:
                retString = "NW";
                break;
        }
    }
    return retString;
};
Tool.GetWindDirectionCode = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "NaN";
    } else {
        var grade = 0;
        var val = parseFloat(dir) + 11.25;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 22.5));
        }
        else {
            grade = 0;
        }
        retString = grade;
    }
    return retString;
};
Tool.getWindDirectionByDesc=function (desc) {

    var retString =[];
    for(var i=0;i<desc.length;i++){
        switch (desc[i]){
            case "无持续风向":
            case "无持续向":
            case "无持续风":
            case "无持续向风":
                retString.push("No sustained wind direction");
                break;
            case "北风":
                retString.push("N");
                break;

            case "东北风":
                retString.push("NE");
                break;
            case "东风":
                retString.push("E");
                break;
            case "东南风":
                retString.push("SE");
                break;
            case "南风":
                retString.push("S");
                break;
            case "西南风":
                retString.push("SW");
                break;
            case "西风":
                retString.push("W");
                break;
            case "西北风":
                retString.push("NW");
                break;
        }
    }
    return retString.length==1?retString.join(" "):retString.join(" to ");
}
Tool.getWeatherdescByDesc=function (desc) {
    var retString =[];
    for(var i=0;i<desc.length;i++){
        switch (desc[i]){
            case "多云":
                retString.push("cloudy");
                break;
            case "阴":
                retString.push("overcast");
                break;
            case "晴":
                retString.push("Sunny");
                break;
            case "阵雨":
                retString.push("shower");
                break;
            case "雷阵雨":
                retString.push("thundershower");
                break;
            case "雷阵雨冰雹":
                retString.push("thundershower with hail");
                break;
            case "雨夹雪":
                retString.push("sleet");
                break;
            case "小雨":
                retString.push("light rain");
                break;
            case "中雨":
                retString.push("moderate rain");
                break;
            case "大雨":
                retString.push("heavy rain");
                break;
            case "暴雨":
                retString.push("Torrential rain");
                break;
            case "大暴雨":
                retString.push("Heavy torrential rain");
                break;
            case "特大暴雨":
                retString.push("Extremely torrential rain");
                break;
            case "阵雪":
                retString.push("snow shower");
                break;
            case "小雪":
                retString.push("light snow");
                break;
            case "中雪":
                retString.push("moderate snow");
                break;
            case "大雪":
                retString.push("heavy snow");
                break;
            case "暴雪":
                retString.push("Torrential snow");
                break;
            case "雾":
                retString.push("fog");
                break;
            case "冻雨":
                retString.push("Freezing rain");
                break;
            case "沙尘暴":
                retString.push("sand storm");
                break;
            case "浮尘":
                retString.push("Dust");
                break;
            case "扬沙":
                retString.push("Blowing sand");
                break;
            case "强沙尘暴":
                retString.push("Severe sandstorm");
                break;
            case "雨":
                retString.push("rain");
                break;
            case "雪":
                retString.push("snow");
                break;
            case "霾":
                retString.push("haze");
                break;
        }
    }
    return retString.length==1?retString.join(" "):retString.join('<strong style="text-transform: lowercase;display: inline-block;margin: 0 6px;">to</strong>');
}
//计算风力
Tool.GetWindLevel = function (val) {
    if (val == "")
        return 0;
    var c = parseFloat(val);
    var fldj = 0;
    if (c >= 0 && c <= 0.2)
        fldj = 0;
    else if (c > 0.2 && c <= 1.5)
        fldj = 1;
    else if (c > 1.5 && c <= 3.3)
        fldj = 2;
    else if (c > 3.3 && c <= 5.4)
        fldj = 3;
    else if (c > 5.4 && c <= 7.9)
        fldj = 4;
    else if (c > 7.9 && c <= 10.7)
        fldj = 5;
    else if (c > 10.7 && c <= 13.8)
        fldj = 6;
    else if (c > 13.8 && c <= 17.1)
        fldj = 7;
    else if (c > 17.1 && c <= 20.7)
        fldj = 8;
    else if (c > 20.7 && c <= 24.4)
        fldj = 9;
    else if (c > 24.4 && c <= 28.4)
        fldj = 10;
    else if (c > 28.4 && c <= 32.6)
        fldj = 11;
    else if (c > 32.6 && c <= 36.9)
        fldj = 12;
    else if (c > 36.9 && c <= 41.4)
        fldj = 13;
    else if (c > 41.4 && c <= 46.1)
        fldj = 14;
    else if (c > 46.1 && c <= 50.9)
        fldj = 15;
    else if (c > 50.9 && c <= 56)
        fldj = 16;
    else if (c > 56 && c <= 61.2)
        fldj = 17;
    else if (c > 61.2)
        fldj = 18;
    return fldj;
};

//根据风力转换km/h

Tool.GetWindKmBySpeed = function (val) {
    if (val == "")
        return 0;
    var c = parseFloat(val);
    var fldj = 0;
    if (c > 0 && c <= 0.2)
        fldj = Math.round(0.2*3.6);
    else if (c > 0.2 && c <= 1.5)
        fldj = Math.round(1.5*3.6);
    else if (c > 1.5 && c <= 3.3)
        fldj = Math.round(3.3*3.6);
    else if (c > 3.3 && c <= 5.4)
        fldj = Math.round(5.4*3.6);
    else if (c > 5.4 && c <= 7.9)
        fldj = Math.round(7.9*3.6);
    else if (c > 7.9 && c <= 10.7)
        fldj = Math.round(10.7*3.6);
    else if (c > 10.7 && c <= 13.8)
        fldj = Math.round( 13.8*3.6);
    else if (c > 13.8 && c <= 17.1)
        fldj = Math.round(17.1*3.6);
    else if (c > 17.1 && c <= 20.7)
        fldj = Math.round(20.7*3.6);
    else if (c > 20.7 && c <= 24.4)
        fldj = Math.round(24.4*3.6);
    else if (c > 24.4 && c <= 28.4)
        fldj = Math.round(28.4*3.6);
    else if (c > 28.4 && c <= 32.6)
        fldj = Math.round(32.6*3.6);
    else if (c > 32.6 && c <= 36.9)
        fldj = Math.round(36.9*3.6);
    else if (c > 36.9 && c <= 41.4)
        fldj = Math.round(41.4*3.6);
    else if (c > 41.4 && c <= 46.1)
        fldj = Math.round(50.9*3.6);
    else if (c > 46.1 && c <= 50.9)
        fldj = Math.round(50.9*3.6);
    else if (c > 50.9 && 3.6 <= 56)
        fldj = Math.round(56*3.6);
    else if (c > 56 && c <= 61.2)
        fldj = Math.round(61.2*3.6);
    else if (c > 61.2)
        fldj = Math.round(61.2*3.6);
    return fldj;
};
Tool.GetWindKmByLevel = function (val) {
    if (val == "")
        return 0;
    var c = parseFloat(val);
    var fldj = 0;
    if (c==0)
        fldj = Math.round(0.2*3.6);
    else if (c ==1)
        fldj = Math.round(1.5*3.6);
    else if (c ==2)
        fldj = Math.round(3.3*3.6);
    else if (c ==3)
        fldj = Math.round(5.4*3.6);
    else if (c ==4)
        fldj = Math.round(7.9*3.6);
    else if (c ==5)
        fldj = Math.round(10.7*3.6);
    else if (c ==6)
        fldj = Math.round( 13.8*3.6);
    else if (c ==7)
        fldj = Math.round(17.1*3.6);
    else if (c ==8)
        fldj = Math.round(20.7*3.6);
    else if (c ==9)
        fldj = Math.round(24.4*3.6);
    else if (c ==10)
        fldj = Math.round(28.4*3.6);
    else if (c ==11)
        fldj = Math.round(32.6*3.6);
    else if (c ==12)
        fldj = Math.round(36.9*3.6);
    else if (c ==13)
        fldj = Math.round(41.4*3.6);
    else if (c ==14)
        fldj = Math.round(50.9*3.6);
    else if (c ==15)
        fldj = Math.round(50.9*3.6);
    else if (c ==16)
        fldj = Math.round(56*3.6);
    else if (c ==17)
        fldj = Math.round(61.2*3.6);
    else if (c =18)
        fldj = Math.round(61.2*3.6);
    return fldj;
};





//返回HTML
Tool.GetRealHtml = function (html, prefix) {
    if (prefix == null || prefix == undefined)
        prefix = "";
    html = prefix + html;
    html = html.replace(/&#010;&#013;/g, "<br />" + prefix);
    html = html.replace(/&#013;/g, "<br />" + prefix);
    html = html.replace(/&amp;quot;/g, "\"");
    html = html.replace(/&lt;/g, "<");
    html = html.replace(/&gt;/g, ">");
    html = html.replace(/&amp;lt;/g, "<");
    html = html.replace(/&amp;gt;/g, ">");
    return html;
};
//URL编码
Tool.Encoding = function (URL) {
    return encodeURIComponent(encodeURIComponent(URL));
};
//URL解码
Tool.Decoding = function (URL) {
    return decodeURIComponent(decodeURIComponent(URL));
};

//数组排序
Tool.ArryCompare = function (param1, param2) {
    //如果两个参数均为字符串类型
    if (typeof param1 == "string" && typeof param2 == "string") {
        return param1.localeCompare(param2);
    }
    //如果参数1为数字，参数2为字符串
    if (typeof param1 == "number" && typeof param2 == "string") {
        return -1;
    }
    //如果参数1为字符串，参数2为数字
    if (typeof param1 == "string" && typeof param2 == "number") {
        return 1;
    }
    //如果两个参数均为数字
    if (typeof param1 == "number" && typeof param2 == "number") {
        if (param1 > param2) return -1;
        if (param1 == param2) return 0;
        if (param1 < param2) return 1;
    }
};
//根据天气编码获取对应中文名称
Tool.GetWeatherDesc = function(num) {
    if(null==num){
        num = "9999";
    }
    num = num.toString();
    var desc = "",descEN='';
    switch (num) {
        case "0":
            desc = "晴";
            descEN='sun';
            break;
        case "1":
            desc = "多云";
            descEN='cloudy';
            break;
        case "2":
            desc = "阴";
            descEN='Yin';
            break;
        case "3":
            desc = "阵雨";
            descEN='rain';
            break;
        case "4":
            desc = "雷阵雨";
            descEN='rain';
            break;
        case "5":
            desc = "雷阵雨冰雹";
            descEN='thunderstorms hail';
            break;
        case "6":
            desc = "雨夹雪";
            descEN='sleet';
            break;
        case "7":
            desc = "小雨";
            descEN='rain';
            break;
        case "8":
            desc = "中雨";
            descEN='rain';
            break;
        case "9":
            desc = "大雨";
            descEN='rain';
            break;
        case "10":
            desc = "暴雨";
            descEN='rain';
            break;
        case "11":
            desc = "大暴雨";
            descEN='rain';
            break;
        case "12":
            desc = "特大暴雨";
            descEN='rain';
            break;
        case "13":
            desc = "阵雪";
            descEN='snow';
            break;
        case "14":
            desc = "小雪";
            descEN='snow';
            break;
        case "15":
            desc = "中雪";
            descEN='snow';
            break;
        case "16":
            desc = "大雪";
            descEN='snow';
            break;
        case "17":
            desc = "暴雪";
            descEN='snow';
            break;
        case "18":
            desc = "雾";
            descEN='fog';
            break;
        case "19":
            desc = "冻雨";
            descEN='freezing rain';
            break;
        case "20":
            desc = "沙尘暴";
            descEN='dust storm';
            break;
        case "21":
            desc = "小雨-中雨";
            descEN='rain';
            break;
        case "22":
            desc = "中雨-大雨";
            descEN='rain';
            break;
        case "23":
            desc = "大雨-暴雨";
            descEN='rain';
            break;
        case "24":
            desc = "暴雨-大暴雨";
            descEN='rain';
            break;
        case "25":
            desc = "大暴雨-特大暴雨";
            descEN='rain';
            break;
        case "26":
            desc = "小雪-中雪";
            descEN='snow';
            break;
        case "27":
            desc = "中雪-大雪";
            descEN='snow';
            break;
        case "28":
            desc = "大雪-暴雪";
            descEN='snow';
            break;
        case "29":
            desc = "浮尘";
            descEN='suspended dust';
            break;
        case "30":
            desc = "扬沙";
            descEN='blowing sand';
            break;
        case "31":
            desc = "强沙尘暴";
            descEN='heavy sandstorms';
            break;
        case "32":
            desc = "雨";
            descEN='rain';
            break;
        case "33":
            desc = "雾";
            descEN='fog';
            break;
        case "53":
            desc = "霾";
            descEN='haze';
            break;
        default:
            desc = "NULL";
            descEN='NULL';
            break;
    }
    return desc;
};

//根据天气编码获取对应英文
Tool.GetWeatherDescEn = function(num) {
    if(null==num){
        num = "9999";
    }
    num = num.toString();
    var desc = "",descEN='';
    switch (num) {
        case "0":
            desc = "晴";
            descEN='Sunny';
            break;
        case "1":
            desc = "多云";
            descEN='Cloudy';
            break;
        case "2":
            desc = "阴";
            descEN='Overcast';
            break;
        case "3":
            desc = "阵雨";
            descEN='shower';
            break;
        case "4":
            desc = "雷阵雨";
            descEN='thundershower';
            break;
        case "5":
            desc = "雷阵雨冰雹";
            descEN='thundershower with hail';
            break;
        case "6":
            desc = "雨夹雪";
            descEN='sleet';
            break;
        case "7":
            desc = "小雨";
            descEN='light rain';
            break;
        case "8":
            desc = "中雨";
            descEN='moderate rain';
            break;
        case "9":
            desc = "大雨";
            descEN='Heavy rain';
            break;
        case "10":
            desc = "暴雨";
            descEN='rainstorm';
            break;
        case "11":
            desc = "大暴雨";
            descEN='downpour';
            break;
        case "12":
            desc = "特大暴雨";
            descEN='severe rainstorm';
            break;
        case "13":
            desc = "阵雪";
            descEN='snow shower';
            break;
        case "14":
            desc = "小雪";
            descEN='light snow';
            break;
        case "15":
            desc = "中雪";
            descEN='moderate snow';
            break;
        case "16":
            desc = "大雪";
            descEN='heavy snow';
            break;
        case "17":
            desc = "暴雪";
            descEN='snowstorm';
            break;
        case "18":
            desc = "雾";
            descEN='fog';
            break;
        case "19":
            desc = "冻雨";
            descEN='ice rain';
            break;
        case "20":
            desc = "沙尘暴";
            descEN='sand storm';
            break;
        case "21":
            desc = "小雨-中雨";
            descEN='light rain to moderate rain';
            break;
        case "22":
            desc = "中雨-大雨";
            descEN='moderate rain to heavy rain';
            break;
        case "23":
            desc = "大雨-暴雨";
            descEN='heavy rain to rainstorm ';
            break;
        case "24":
            desc = "暴雨-大暴雨";
            descEN='rainstorm to downpour';
            break;
        case "25":
            desc = "大暴雨-特大暴雨";
            descEN='downpour to severe rainstorm';
            break;
        case "26":
            desc = "小雪-中雪";
            descEN='light snow to moderate snow';
            break;
        case "27":
            desc = "中雪-大雪";
            descEN='moderate snow to heavy snow';
            break;
        case "28":
            desc = "大雪-暴雪";
            descEN='heavy snow to snowstorm';
            break;
        case "29":
            desc = "浮尘";
            descEN='airborne dust';
            break;
        case "30":
            desc = "扬沙";
            descEN='sand blowing';
            break;
        case "31":
            desc = "强沙尘暴";
            descEN='heavy sandstorm';
            break;
        case "32":
            desc = "雨";
            descEN='rain';
            break;
        case "33":
            desc = "雪";
            descEN='snow';
            break;
        case "53":
            desc = "霾";
            descEN='haze';
            break;
        default:
            desc = "NULL";
            descEN='NULL';
            break;
    }
    return descEN
};


//对象拼接
Tool.MergeObj = function(o1,o2,index){
    var o = new Object();
    for(var k in o1){
        o[k] = o1[k];
    }
    for(var j in o2){
        if(index==0){
            if(!(j in o)){
                o[j] = o2[j];
            }
        }else{
            o[j] = o2[j];
        }
    }
    return o;
};

//String原型链拓展
String.prototype.Format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
String.prototype.Trim = function (str) {
    var regex = eval("/^" + str + "*|" + str + "*$/g");
    return this.replace(regex, "");
};
String.prototype.TrimStart = function (str) {
    var regex = eval("/^" + str + "*/g");
    return this.replace(regex, "");
};
String.prototype.TrimEnd = function (str) {
    var regex = eval("/" + str + "*$/g");
    return this.replace(regex, "");
};
String.prototype.castDateTime = function () {
    return new Date(this.replace(/-/g, '/'));
};
String.prototype.castChineseCharDateTime = function () {
    return new Date(this.replace("年","/").replace("月","/").replace("日","/").replace("时",":").replace("分",":").replace("秒",""));
};

//Date原型链拓展
Date.prototype.Format = function (fmt) {
    var o =
        {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};
Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};
Date.prototype.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};
Date.prototype.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
};
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + parseInt(h));
};
Date.prototype.addMinute = function (m) {
    this.setMinutes(this.getMinutes() + parseInt(m));
};