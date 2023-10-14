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
    var r = window.location.search.substr(1).match(reg);
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
//获取URL的参数
Tool.getParams=function(paras) {
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

function objClone(myObj){
    if(typeof(myObj) != 'object') return myObj;
    if(myObj == null) return myObj;
    var myNewObj = new Object();
    for(var i in myObj)
        myNewObj[i] = objClone(myObj[i]);
    return myNewObj;
}

/**
 *  按照字段排序
 * @param field 字段
 * @param isAsc true 为升序 false为降序
 * @returns {Array}
 */
Array.prototype.sortField = function(field, isAsc)
{
    if(this == null)
    {
        throw new Error("Array is null.");
    }
    var tmp;
    if(isAsc)
    {
        for(var i = 0; i < this.length; i++)
        {
            for(var j = i; j < this.length; j++)
            {
                if(this[i][field] > this[j][field])
                {
                    tmp = this[i];
                    this[i] = this[j];
                    this[j] = tmp;
                }
            }
        }
    }
    else
    {
        for(i = 0; i < this.length; i++)
        {
            for(j = i; j < this.length; j++)
            {
                if(this[i][field] < this[j][field])
                {
                    tmp = this[i];
                    this[i] = this[j];
                    this[j] = tmp;
                }
            }
        }
    }
    return this;
};

// 计算八风向
Tool.GetWindEightDirection = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "静风";
    }
    else {
        var grade = 0;
        var val = parseFloat(dir) + 25;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 45));
        }
        else {
            grade = 0;
        }
        switch (grade) {
            case 0:
                retString = "北";
                break;
            case 1:
                retString = "东北";
                break;
            case 2:
                retString = "东";
                break;
            case 3:
                retString = "东南";
                break;
            case 4:
                retString = "南";
                break;
            case 5:
                retString = "西南";
                break;
            case 6:
                retString = "西";
                break;
            case 7:
                retString = "西北";
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

// 图片路径
Tool.GetWeatherImg = function (code){
    var weatherImg;
    switch (code){
        case 0:
            weatherImg = "style/images/weather_img/晴.png";
            break;
        case 1:
            weatherImg = "style/images/weather_img/多云.png";
            break;
        case 2:
            weatherImg = "style/images/weather_img/阴.png";
            break;
        case 3:
            weatherImg = "style/images/weather_img/阵雨.png";
            break;
        case 4:
            weatherImg = "style/images/weather_img/雷阵雨.png";
            break;
        case 5:
            weatherImg = "style/images/weather_img/雷阵雨伴冰雹.png";
            break;
        case 6:
            weatherImg = "style/images/weather_img/雨夹雪.png";
            break;
        case 7:
            weatherImg = "style/images/weather_img/小雨.png";
            break;
        case 8:
            weatherImg = "style/images/weather_img/中雨.png";
            break;
        case 9:
            weatherImg = "style/images/weather_img/大雨.png";
            break;
        case 10:
            weatherImg = "style/images/weather_img/暴雨.png";
            break;
        case 11:
            weatherImg = "style/images/weather_img/大暴雨.png";
            break;
        case 12:
            weatherImg = "style/images/weather_img/特大暴雨.png";
            break;
        case 13:
            weatherImg = "style/images/weather_img/阵雪.png";
            break;
        case 14:
            weatherImg = "style/images/weather_img/小雪.png";
            break;
        case 15:
            weatherImg = "style/images/weather_img/中雪.png";
            break;
        case 16:
            weatherImg = "style/images/weather_img/大雪.png";
            break;
        case 17:
            weatherImg = "style/images/weather_img/暴雪.png";
            break;
        case 18:
            weatherImg = "style/images/weather_img/雾.png";
            break;
        case 19:
            weatherImg = "style/images/weather_img/冻雨.png";
            break;
        case 20:
            weatherImg = "style/images/weather_img/沙尘暴.png";
            break;
        case 21:
            weatherImg = "style/images/weather_img/小雨-中雨.png";
            break;
        case 22:
            weatherImg = "style/images/weather_img/中雨-大雨.png";
            break;
        case 23:
            weatherImg = "style/images/weather_img/大雨-暴雨.png";
            break;
        case 24:
            weatherImg = "style/images/weather_img/暴雨-大暴雨.png";
            break;
        case 25:
            weatherImg = "style/images/weather_img/大暴雨-特大暴雨.png";
            break;
        case 26:
            weatherImg = "style/images/weather_img/小雪-中雪.png";
            break;
        case 27:
            weatherImg = "style/images/weather_img/中雪-大雪.png";
            break;
        case 28:
            weatherImg = "style/images/weather_img/大雪-暴雪.png";
            break;
        case 29:
            weatherImg = "style/images/weather_img/浮尘.png";
            break;
        case 30:
            weatherImg = "style/images/weather_img/扬沙.png";
            break;
        case 31:
            weatherImg = "style/images/weather_img/强沙尘暴.png";
            break;
    }
    return weatherImg;
};

Tool.GetWeather = function (code) {
    var Weather;
    switch (code) {
        case 0:
            Weather = "晴";
            break;
        case 1:
            Weather = "多云";
            break;
        case 2:
            Weather = "阴";
            break;
        case 3:
            Weather = "阵雨";
            break;
        case 4:
            Weather = "雷阵雨";
            break;
        case 5:
            Weather = "雷阵雨冰雹";
            break;
        case 6:
            Weather = "雨夹雪";
            break;
        case 7:
            Weather = "小雨";
            break;
        case 8:
            Weather = "中雨";
            break;
        case 9:
            Weather = "大雨";
            break;
        case 10:
            Weather = "暴雨";
            break;
        case 11:
            Weather = "大暴雨";
            break;
        case 12:
            Weather = "特大暴雨";
            break;
        case 13:
            Weather = "阵雪";
            break;
        case 14:
            Weather = "小雪";
            break;
        case 15:
            Weather = "中雪";
            break;
        case 16:
            Weather = "大雪";
            break;
        case 17:
            Weather = "暴雪";
            break;
        case 18:
            Weather = "雾";
            break;
        case 19:
            Weather = "冻雨";
            break;
        case 20:
            Weather = "沙尘暴";
            break;
        case 21:
            Weather = "小雨到中雨";
            break;
        case 22:
            Weather = "中雨到大雨";
            break;
        case 23:
            Weather = "大雨到暴雨";
            break;
        case 24:
            Weather = "暴雨到大暴雨";
            break;
        case 25:
            Weather = "大暴雨到特大暴雨";
            break;
        case 26:
            Weather = "小雪到中雪";
            break;
        case 27:
            Weather = "中雪到大雪";
            break;
        case 28:
            Weather = "大雪到暴雪";
            break;
        case 29:
            Weather = "浮尘";
            break;
        case 30:
            Weather = "扬沙";
            break;
        case 31:
            Weather = "强沙尘暴";
            break;
    }
    return Weather;
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
Date.prototype.addHour = function (h) {
    this.setHours(this.getHours() + parseInt(h));
};
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + parseInt(h));
};
Date.prototype.addMinute = function (m) {
    this.setMinutes(this.getMinutes() + parseInt(m));
};
Date.prototype.getWeek = function (fmt) {
    var weekDay = new Array(7);
    weekDay[0] = "日";
    weekDay[1] = "一";
    weekDay[2] = "二";
    weekDay[3] = "三";
    weekDay[4] = "四";
    weekDay[5] = "五";
    weekDay[6] = "六";
    return fmt + weekDay[this.getDay()];
};
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