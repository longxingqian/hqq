var yTool = new Object();
yTool.Version = function () {
    return "1.0.1";
};
yTool.GetWindDirection = function (dir, speed) {
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
//风向英文
yTool.GetWindDirectionEn = function (dir, speed) {
    var retString   = "";
    var rerENString = "";
    if (speed == 0) {
        retString   = "Variable";
        rerENString = "Variable";
    }else {
        var grade = 0;
        var val = parseFloat(dir) + 11.25;
        if (val < 360) {
            grade = parseInt(Math.floor(val / 22.5));
        }else {
            grade = 0;
        }
        switch (grade) {
            case 0:{
                retString   = "North";//北
                rerENString = "N"
            }break;
            case 1:{
                retString   = "North-North-East";//东北北
                rerENString = "NNE"
            }break;
            case 2:{
                retString   = "North-East";//东北	
                rerENString = "NE"
            }break;
            case 3:{
                retString   = "East-North-East";//东北东
                rerENString = "ENE";
            }break;
            case 4:{
                retString   = "East";//东
                rerENString = "E"
            }break;
            case 5:{
                retString   = "East-South-East";//东南东
                rerENString = "ESE";
            } break;
            case 6:{
                retString   = "South-East";//东南
                rerENString = "SE";
            }break;
            case 7:{
                retString   = "South-South-East";//东南南
                rerENString = "SSE";
            }break;
            case 8:{
                retString   = "South";//南
                rerENString = "S";
            }break;
            case 9:{
                retString   = "South-South-West";//西南南
                rerENString = "SSW";
            } break;
            case 10:{
                retString   = "South-West";//西南
                rerENString = "SW";
            }break;
            case 11:{
                retString   = "West-South-West";//西南西
                rerENString = "WSW";
            }break;
            case 12:{
                retString   = "West";//西
                rerENString = "W";
            }break;
            case 13:{
                retString   = "West-North-West";//西北西
                rerENString = "WNW";
            }break;
            case 14:{
                retString   = "North-West";//西北
                rerENString = "NW";
            }break;               
            case 15:{
                retString   = "North-North-West";//西北北
                rerENString = "NNW";
            }break;
        }
    }
    return rerENString;
};
//天气英文
yTool.GetWeatherDescEn = function(num) {
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
            descEN='Mostly Cloudy';
            break;
        case "2":
            desc = "阴";
            descEN='Overcast';
            break;
        case "3":
            desc = "阵雨";
            descEN='Shower';
            break;
        case "4":
            desc = "雷阵雨";
            descEN='Thunder shower';
            break;
        case "5":
            desc = "雷阵雨冰雹";
            descEN='Hail';
            break;
        case "6":
            desc = "雨夹雪";
            descEN='Snow and rain';
            break;
        case "7":
            desc = "小雨";
            descEN='Light Rain';
            break;
        case "8":
            desc = "中雨";
            descEN='Moderate Rain';
            break;
        case "9":
            desc = "大雨";
            descEN='Heavy Rain';
            break;
        case "10":
            desc = "暴雨";
            descEN='Torrential Rain';
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
            descEN='Snow Shower';
            break;
        case "14":
            desc = "小雪";
            descEN='Light snow';
            break;
        case "15":
            desc = "中雪";
            descEN='Moderate snow';
            break;
        case "16":
            desc = "大雪";
            descEN='Heavy snow';
            break;
        case "17":
            desc = "暴雪";
            descEN='Heavy snow';
            break;
        case "18":
            desc = "雾";
            descEN='Fog';
            break;
        case "19":
            desc = "冻雨";
            descEN='Freezing rain';
            break;
        case "20":
            desc = "沙尘暴";
            descEN='Dust storm';
            break;
        case "21":
            desc = "小雨-中雨";
            descEN='Light rain to Moderate rain';
            break;
        case "22":
            desc = "中雨-大雨";
            descEN='Moderate rain to Heavy rain';
            break;
        case "23":
            desc = "大雨-暴雨";
            descEN='Heavy rain to Torrential Rain ';
            break;
        case "24":
            desc = "暴雨-大暴雨";
            descEN='Torrential Rain to downpour';
            break;
        case "25":
            desc = "大暴雨-特大暴雨";
            descEN='downpour to severe rainstorm';
            break;
        case "26":
            desc = "小雪-中雪";
            descEN='Light snow to Moderate snow';
            break;
        case "27":
            desc = "中雪-大雪";
            descEN='Moderate snow to Heavy snow';
            break;
        case "28":
            desc = "大雪-暴雪";
            descEN='Heavy snow to snowstorm';
            break;
        case "29":
            desc = "浮尘";
            descEN='Floating dust';
            break;
        case "30":
            desc = "扬沙";
            descEN='Dust blowing';
            break;
        case "31":
            desc = "强沙尘暴";
            descEN='heavy sandstorm';
            break;
        case "32":
            desc = "雨";
            descEN='Rain';
            break;
        case "33":
            desc = "雪";
            descEN='Snow';
            break;
        case "53":
            desc = "霾";
            descEN='Haze';
            break;
        default:
            desc = "NULL";
            descEN='NULL';
            break;
    }
    return descEN
};
yTool.GetWindDirection8EN = function (dir, speed) {
    var retString = "";
    if (speed == 0) {
        retString = "Variable";
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
yTool.fomatFloat = function (value, n) {
    var f  = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    var s  = f.toString();
    var rs = s.indexOf('.');   
    if (rs < 0) {     
        s += '.';   
    } 
    for(var i = s.length - s.indexOf('.'); i <= n; i++){
      s += "0";
    }
    return s;
}