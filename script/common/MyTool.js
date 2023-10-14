// 将Date取整小时；返回出一个新的Date;
Date.prototype.minToZero = function () {
    var t = new Date(this);
    t.setMinutes(0);
    t.setSeconds(0);
    return t;
}
// 减去h小时；返回出一个新的Date;
Date.prototype.addHours = function (h) {
    var t = new Date(this);
    return new Date((t.getTime() + h * 1000 * 60 * 60));
};
// 减去d天；返回出一个新的Date;
Date.prototype.subDays = function (d) {
    var t = new Date(this);
    t.setDate(this.getDate() - d);
    return t;
};

// 减去m分钟；返回出一个新的Date;
Date.prototype.subMins = function (m) {
    var t = new Date(this);
    return new Date((t.getTime() + m * 1000 * 60));
};

// 返回明天；
Date.prototype.addDay = function (d) {
    var t = new Date(this);
    return new Date((t.getTime() + d * 1000 * 60 * 60 * 24));
}

function MyTool() { };
MyTool.returnTomorrow = function (date) {
    if (date) {
        var n = new Date(date);
    } else {
        var n = new Date();
    }
    return new Date(n.setDate((n.getDate() + 1)));
};
MyTool.returnYesterday = function (date) {
    if (date) {
        var n = new Date(date);
    } else {
        var n = new Date();
    }
    return new Date(n.setDate((n.getDate() - 1)));
};
MyTool.btnFlash = function (ele, cssStyle) {
    var that = ele;
    that.css(cssStyle);
    var timer = setTimeout(function () {
        that.removeAttr('style');
    }, 300);
};
// 返回传入日期的几天前或几天后；
MyTool.returnAddDay = function (date, addDayCount) {
    var n = new Date(date);
    return new Date(n.setDate((n.getDate() + addDayCount)));
};
// 返回数组中的最大值；Null为负无穷大；
MyTool.returnMax = function (arr) {
    var max = arr[0];
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] != null) {
            if (max == null) {
                max = -Infinity
            };
            max = max > arr[i] ? max : arr[i];
        }
    }
    return max;
};