
var Sun = {
    version: '1.0.18'
};

function expose() {
    var oldSun = window.Sun;

    Sun.noConflict = function () {
        window.Sun = oldSun;
        return this;
    };

    window.Sun = Sun;
}

// define Sun for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = Sun;

// define Sun as an AMD module
} else if (typeof define === 'function' && define.amd) {
    define(Sun);
}

// define Sun as a global Sun variable, saving the original Sun to restore later if needed
if (typeof window !== 'undefined') {
    expose();
}

/*
 * Sun.Util is same with L.Util except name!
 */

Sun.Util = {
	// extend an object with properties of one or more other objects
	extend: function (dest) {
		var i, j, len, src;

		for (j = 1, len = arguments.length; j < len; j++) {
			src = arguments[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// create an object from a given prototype
	create: Object.create || (function () {
		function F() {}
		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// bind a function to be called with a given context
	bind: function (fn, obj) {
		var slice = Array.prototype.slice;

		if (fn.bind) {
			return fn.bind.apply(fn, slice.call(arguments, 1));
		}

		var args = slice.call(arguments, 2);

		return function () {
			return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
		};
	},

	// return unique ID of an object
	stamp: function (obj) {
		/*eslint-disable */
		obj._sun_id = obj._sun_id || ++Sun.Util.lastId;
		return obj._sun_id;
		/*eslint-enable */
	},

	lastId: 0,

	// return a function that won't be called more often than the given interval
	throttle: function (fn, time, context) {
		var lock, args, wrapperFn, later;

		later = function () {
			// reset lock and call if queued
			lock = false;
			if (args) {
				wrapperFn.apply(context, args);
				args = false;
			}
		};

		wrapperFn = function () {
			if (lock) {
				// called too soon, queue to call later
				args = arguments;

			} else {
				// call and lock until later
				fn.apply(context, arguments);
				setTimeout(later, time);
				lock = true;
			}
		};

		return wrapperFn;
	},

	// wrap the given number to lie within a certain range (used for wrapping longitude)
	wrapNum: function (x, range, includeMax) {
		var max = range[1],
		    min = range[0],
		    d = max - min;
		return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
	},

	// do nothing (used as a noop throughout the code)
	falseFn: function () { return false; },

	// round a given number to a given precision
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},

	// trim whitespace from both sides of a string
	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	// split a string into words
	splitWords: function (str) {
		return Sun.Util.trim(str).split(/\s+/);
	},

	// set options to an object, inheriting parent's options as well
	setOptions: function (obj, options) {
		if (!obj.hasOwnProperty('options')) {
			obj.options = obj.options ? Sun.Util.create(obj.options) : {};
		}
		for (var i in options) {
			obj.options[i] = options[i];
		}
		return obj.options;
	},

	// make a URL with GET parameters out of a set of properties/values
	getParamString: function (obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
		}
		return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
	},

	// super-simple templating facility, used for TileLayer URLs
	template: function (str, data) {
		return str.replace(Sun.Util.templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	templateRe: /\{ *([\w_]+) *\}/g,

	isArray: Array.isArray || function (obj) {
		return (Object.prototype.toString.call(obj) === '[object Array]');
	},

	indexOf: function (array, el) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === el) { return i; }
		}
		return -1;
	},

	// minimal image URI, set to an image when disposing to flush memory
	emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

(function () {
	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
	    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
	               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


	Sun.Util.requestAnimFrame = function (fn, context, immediate) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, Sun.bind(fn, context));
		}
	};

	Sun.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};
})();

// shortcuts for most used utility functions
Sun.extend = Sun.Util.extend;
Sun.bind = Sun.Util.bind;
Sun.stamp = Sun.Util.stamp;
Sun.setOptions = Sun.Util.setOptions;

/*
 * Sun.Class is same with L.Class except name!
 */

Sun.Class = function () {};

Sun.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = Sun.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		Sun.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		Sun.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = Sun.Util.extend(Sun.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	Sun.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// method for adding properties to prototype
Sun.Class.include = function (props) {
	Sun.extend(this.prototype, props);
};

// merge new default options to the Class
Sun.Class.mergeOptions = function (options) {
	Sun.extend(this.prototype.options, options);
};

// add a constructor hook
Sun.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
};



Sun.Evented = Sun.Class.extend({

	/* @method on(type: String, fn: Function, context?: Object): this
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	 *
	 * @alternative
	 * @method on(eventMap: Object): this
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	 */
	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = Sun.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	 *
	 * @alternative
	 * @method off(eventMap: Object): this
	 * Removes a set of type/listener pairs.
	 *
	 * @alternative
	 * @method off: this
	 * Removes all listeners to all events on the object.
	 */
	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = Sun.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		var newListener = {fn: fn, ctx: context},
		    listeners = typeListeners;

		// check if fn already there
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
		typeListeners.count++;
	},

	_off: function (type, fn, context) {
		var listeners,
		    i,
		    len;

		if (!this._events) { return; }

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = Sun.Util.falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (i = 0, len = listeners.length; i < len; i++) {
				var l = listeners[i];
				if (l.ctx !== context) { continue; }
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = Sun.Util.falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide an data
	// object — the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = Sun.Util.extend({}, data, {type: type, target: this});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function (type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	// @method once(…): this
	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = Sun.bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[Sun.stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[Sun.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, Sun.extend({layer: e.target}, e), true);
		}
	}
});

var proto = Sun.Evented.prototype;

// aliases; we should ditch those eventually

// @method addEventListener(…): this
// Alias to [`on(…)`](#evented-on)h
proto.addEventListener = proto.on;

// @method removeEventListener(…): this
// Alias to [`off(…)`](#evented-off)

// @method clearAllEventListeners(…): this
// Alias to [`off()`](#evented-off)
proto.removeEventListener = proto.clearAllEventListeners = proto.off;

// @method addOneTimeEventListener(…): this
// Alias to [`once(…)`](#evented-once)
proto.addOneTimeEventListener = proto.once;

// @method fireEvent(…): this
// Alias to [`fire(…)`](#evented-fire)
proto.fireEvent = proto.fire;

// @method hasEventListeners(…): Boolean
// Alias to [`listens(…)`](#evented-listens)
proto.hasEventListeners = proto.listens;

Sun.Mixin = {Events: proto};

/**
 * 工具类
 *
 * Features :
 *      1. 通用工具
 *      2. 数组工具
 *
 * @module Util
 */

/**
 * 基础通用工具
 *
 * Features :
 *      1. 有效值的判断
 *      2. 插入css文件
 *      3. 获取js文件地址的前缀
 *
 * Update Note：
 *      + v1.0.0 ：Created
 *      + v1.0.17 ：增加是否是IE浏览器的判定
 *
 * @class Sun.Util.Common
 */
Sun.Util.Common = {
    /**
     * 判断是否为有效值
     * @method isValid
     * @param x {*}
     */
    isValid : function (x) {
        return x !== null && (typeof x !== 'undefined');
    },


    /**
     * 获取有效的字符串--若参数为null或undefined转为字符串
     * @method getValidString
     * @param s {string|null|undefined}
     * @returns {*}
     */
    getValidString : function (s) {
        return Sun.Util.Common.isValid(s) ? s : '';
    },

    /**
     * 判断浏览器是否是火狐浏览器
     * @method isFF
     * @returns {boolean}
     */
    isFF : function () {
        return (/firefox/i).test(navigator.userAgent);
    },

    isIE : function () {
        return !!window.ActiveXObject || "ActiveXObject" in window;
    },

    /**
     * 移除传入对象的所有孩子
     * @method removeAllChildren
     * @param parent {object}
     */
    removeAllChildren : function (parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    },

    /**
     * 插入css文件
     * @method createCssLink
     * @param file {string} css文件地址
     */
    createCssLink : function (file) {
        var new_element = $("<link />").attr({
            "type": "text/css",
            "rel": "stylesheet",
            "href": file
        });
        $("head").append(new_element);
    },

    /**
     * 获取js文件地址的前缀
     * @method getScriptUrlPrefix
     * @param scriptName {string} js文件的名字，需在引用的js文件中是唯一的名字
     */
    getScriptUrlPrefix : function (scriptName) {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src;
            if (src) {
                var index = src.indexOf(scriptName + '.js');
                if(index != -1)
                    return src.slice(0,index);
                // var res = src.match(scriptName + '.js');
                // if (res) {
                //     return res.input.replace(scriptName + '.js', '');
                // }
            }
        }
    },

    // 获取文本宽度
    getTextWidth:function(str){
        var span = document.createElement('span');
        span.innerText = str;
        document.querySelector('body').appendChild(span);
        var width = span.offsetWidth;
        span.remove();
        return width;
    },

    /**
     * 选择某个对象,用于执行execCommand('copy')
     * @method select
     * @param element
     * @returns {*}
     */
    select:function (element) {
        var selectedText;

        if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
            element.focus();
            element.setSelectionRange(0, element.value.length);

            selectedText = element.value;
        }
        else {
            if (element.hasAttribute('contenteditable')) {
                element.focus();
            }

            var selection = window.getSelection();
            var range = document.createRange();

            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);

            selectedText = selection.toString();
        }
        return selectedText;
    },

    /**
     * 下载指定地址的文件
     * @method download
     * @param href
     * @param fileName
     */
    download:function (href,fileName) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = href;
        save_link.download = fileName;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }
};

/**
 * 日期格式化
 * @method format
 * @param fmt {string}
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 *      例子：
 *          (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *          (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 添加、减少年/月/周/天/时/分
 */
Date.prototype.addYears = function (y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
};

Date.prototype.addMonths = function (m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addWeeks = function (w) {
    this.addDays(w * 7);
};

Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + parseInt(h));
};
Date.prototype.addMinutes = function (m) {
    this.setMinutes(this.getMinutes() + parseInt(m));
};

//String原型链拓展
String.prototype.format = function (args) {
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

String.prototype.castDateTime = function () {
    return new Date(this.replace(/-/g, '/'));
};

/**
 * @module Util
 */

/**
 * 完善Array.indexOf兼容性
 */
Array.indexOf || (Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == item) return i;
    }
    return -1
});

Array.prototype.unique = function () {
    var arr = [];
    for(var i = 0;i<this.length;i++){
        if(arr.indexOf(this[i]) == -1)
            arr.push(this[i]);
    }
    return arr;
};


/**
 * 数组工具
 *
 * Features :
 *      1. 对数组的合并
 *      2. 获取数组中的指定项
 *      3. 去除指定字段值重复的项
 *
 * Update Note：
 *      + v1.0.0 ：Created
 *
 * @class Sun.Util.Array
 */
Sun.Util.Array = {
    /**
     * 合并多个数组
     * @param arrays
     * @returns {Array}
     */
    merge:function (arrays) {
        var n = arrays.length, m, i = -1, j = 0, merged, array;
        while (++i < n) j += arrays[i].length;
        merged = new Array(j);
        while (--n >= 0) {
            array = arrays[n];
            m = array.length;
            while (--m >= 0) {
                merged[--j] = array[m];
            }
        }
        return merged;
    },
    /**
     * get item's index that assign fieldName mapping value in array.
     * @method getItemIndexByField
     * @param arr {Array}
     * @param fieldName {string}
     * @param value {*}
     * @returns {number}
     */
    getItemIndexByField : function (arr, fieldName, value) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item[fieldName] == value)
                return i;
        }
        return -1;
    },

    /**
     * get item that assign fieldName mapping value in array.
     * @method getItemByField
     * @param arr {Array}
     * @param fieldName {string}
     * @param value {*}
     * @returns {*}
     */
    getItemByField : function (arr, fieldName, value) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item[fieldName] == value)
                return item;
        }
        return null;
    },

    getMinValObject : function (source, fieldName) {
        if(source && source.length>0){
            var min=source[0][fieldName],index=0;
            for(var i=0;i<source.length;i++){
                if(source[i][fieldName]<min){
                    min=source[i][fieldName];
                    index=i;
                }
            }
            return source[index];
        }
    },

    getMaxValObject : function (source, fieldName) {
        if(source && source.length>0){
            var max=parseFloat(source[0][fieldName]),index=0;
            max = isNaN(max)?-1:max;
            for(var i=0;i<source.length;i++){
                if(parseFloat(source[i][fieldName])>max){
                    max=source[i][fieldName];
                    index=i;
                }
            }
            return source[index];
        }
    },

    /**
     * 获得第一个有效数据
     * @method getFirstValidData
     * @param arr {Array}
     * @param fieldName {string}
     */
    getFirstValidData : function (arr, fieldName) {
        for (var i = 0; i < arr.length; i++) {
            var value = arr[i][fieldName];
            if (value != 'null' || value.toString() != '' || !isNaN(value))
                return arr[i];
        }
        return null;
    },

    /**
     * 去除指定字段值重复的项
     * @method getFirstValidData
     * @param source {Array}
     * @param codeField {string}
     */
    excludeSameCodeData : function (source, codeField) {
        var arr = [];
        var item = source[0];
        for (var i = 1; i < source.length; i++) {
            if (item[codeField] != source[i][codeField])
                arr.push(item);
            item = source[i];
        }
        return arr;
    }
};
/**
 * @module Util
 */

/**
 * 颜色工具
 *
 * Features :
 *      1. rgb颜色值和十六进制颜色值之间的互转
 *      2. 十进制颜色值转十六进制颜色值
 *
 * Update Note：
 *      + v1.0.0 ：Created
 *
 * @class Sun.Util.Color
 */
Sun.Util.Color = {
    /**
     * Convert rgb value to hex value.
     * rgb值转十六进制值
     * @method rgbToHex
     * @param r
     * @param g
     * @param b
     * @returns {string} eg:'#00ff00'
     */
    rgbToHex : function (r, g, b) {
        var s = ((r << 16) | (g << 8) | b).toString(16);
        while (s.length < 6)
            s = "0" + s;
        return '#' + s;
    },

    /**
     * 十进制值转十六进制值颜色
     * @method toHexColor
     * @param num {number} 十进制颜色值
     * @returns {string} eg:'#00ff00'
     */
    toHexColor : function (num) {
        var s = num.toString(16);
        while (s.length < 6)
            s = "0" + s;
        return '#' + s;
    },

    /**
     * rgba值转rgba字符串
     * @method asColorStyle
     * @param r
     * @param g
     * @param b
     * @param a
     * @returns {string} eg:'rgba(255,255,255,0.5)'
     */
    asColorStyle : function (r, g, b, a) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    },

    /**
     * 获取随机颜色
     * @returns {string}
     */
    getRandomColor: function () {
        return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
    },

    /**
     * 十六进制值转rgba值
     * @method colorToRgb
     * @param sColor {string} '#00ff00'
     * @param returnType {int} 0: RGB(0,0,0) || 1: [0,0,0]
     * @param alpha
     * @returns {*}
     */
    colorToRgb : function (sColor, returnType, alpha) {
        sColor = sColor.toLowerCase();
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            if (returnType == 0){
                alpha = typeof alpha != 'undefined' ? ',' + alpha : '';
                return "RGB(" + sColorChange.join(",") + alpha + ")";
            }
            else if (returnType == 1)
                return sColorChange;
        } else {
            return sColor;
        }
    },

    /**
     * Creates a color scale composed of the specified segments. Segments is an array of two-element arrays of the
     * form [value, color], where value is the point along the scale and color is the [r, g, b] color at that point.
     * For example, the following creates a scale that smoothly transitions from red to green to blue along the
     * points 0.5, 1.0, and 3.5:
     *
     *     [ [ 0.5, [255, 0, 0] ],
     *       [ 1.0, [0, 255, 0] ],
     *       [ 3.5, [0, 0, 255] ] ]
     *
     * @param segments array of color segments
     * @returns {Function} a function(point, alpha) that returns the color [r, g, b, alpha] for the given point.
     */
    segmentedColorScale : function (segments) {
        function colorInterpolator(start, end) {
            var r = start[0], g = start[1], b = start[2];
            var Δr = end[0] - r, Δg = end[1] - g, Δb = end[2] - b;
            return function (i, a) {
                return [Math.floor(r + i * Δr), Math.floor(g + i * Δg), Math.floor(b + i * Δb), a];
                //return [r,g,b,a];
            };

        }
        /**
         * @returns {number} the fraction of the bounds [low, high] covered by the value x, after clamping x to the
         *          bounds. For example, given bounds=[10, 20], this method returns 1 for x>=20, 0.5 for x=15 and 0
         *          for x<=10.
         */
        function proportion(x, low, high) {
            return (clamp(x, low, high) - low) / (high - low);
        }
        /**
         * @returns {Number} the value x clamped to the range [low, high].
         */
        function clamp(x, low, high) {
            return Math.max(low, Math.min(x, high));
        }

        var points = [], interpolators = [], ranges = [];
        for (var i = 0; i < segments.length - 1; i++) {
            points.push(segments[i + 1][0]);
            interpolators.push(colorInterpolator(segments[i][1], segments[i + 1][1]));
            ranges.push([segments[i][0], segments[i + 1][0]]);
        }

        return function (point, alpha) {
            var i;
            for (i = 0; i < points.length - 1; i++) {
                if (point <= points[i]) {
                    break;
                }
            }
            var range = ranges[i];
            return interpolators[i](proportion(point, range[0], range[1]), alpha);
        };
    }
};

/**
 * @module Util
 */

/**
 * Double(webservice 需用到的数据类型)
 * @param value
 */

window.Double = function(value) {
    this.value = value;
}/**
 * Decimal(webservice 需用到的数据类型)
 * @param value
 */
window.Decimal = function(value) {
    this.value = value;
}
/**
 * 数据工具
 *
 * Features :
 *      1. object/Array 的克隆
 *      2. 字符串转Unicode编码数据
 *      3. 将returntype=5得到的数据转为returntype=4的数据
 *      4. 将网格nc数据转为json
 *
 * Update Note：
 *      + v1.0.8 ：Created(transfer from LW.Util.Data)
 *      + v1.0.11 ：changeGridNcToJson增加nc数据version2.0的解析
 *      + v1.0.13 : changeGridNcToJson增加nc站点数据的解析
 *      + v1.0.16 : 1. changeGridNcToJson删除nc站点数据的解析;删除isWind属性,直接用code是否为uv判断风属性
 *                  2. changeGridNcToJson增加nc数据version3.0的解析
 *                  3. 增加valueInRange方法判断值是否在区间内
 *      + v1.0.18 : 增加changeMicapsToJson方法，将micaps数据转为json
 *
 * @class Sun.Util.Data
 */
Sun.Util.Data = {
    /**
     * object对象克隆
     * 只支持一层object克隆
     * @method clone
     * @param object
     * @returns {*}
     */
    clone:function(object){
        if (typeof(object) != 'object' || object == null) return object;
        var newObj = {};
        for (var s in object) {
            newObj[s] = object[s];
        }
        return newObj;
    },

    /**
     * 数据深克隆,克隆Array或Object
     * @method deepClone
     * @param src
     * @returns {*}
     */
    deepClone:function(src){
        function _type(value) {
            // typeof({}) -- "object"   typeof([]) -- "object"    typeof(null) -- "object"
            return Object.prototype.toString.call(value).slice(8).slice(0, -1).toLowerCase();
        }

        function isArray(value) {
            return _type(value) == 'array';
        }

        function isObject(value) {
            return _type(value) == 'object';
        }

        function cloneArray(src, dest) {
            src.forEach(function(item, index) {
                if (isArray(item)) {
                    dest[index] = [];
                    cloneArray(src[index], dest[index]);
                }
                else if(isObject(item)){
                    dest[index] = {};
                    cloneObject(src[index], dest[index]);
                }
                else {
                    dest[index] = src[index];
                }
            });


        }

        function cloneObject(src, dest) {
            for (var key in src) {
                // 过滤原型链上面的属性
                if (src.hasOwnProperty(key)) {
                    if (isObject(src[key])) {
                        // 判断循环引用的问题
                        if (src[key] === src) {
                            dest[key] = src;
                        } else {
                            dest[key] = {};
                            cloneObject(src[key], dest[key]);
                        }
                    } else if (isArray(src[key])) {

                        dest[key] = [];
                        cloneArray(src[key], dest[key])
                    } else {
                        dest[key] = src[key];
                    }
                }
            }

        }

        var dest;
        if (isArray(src)) {
            dest = [];
            cloneArray(src, dest);
        }
        if (isObject(src)) {
            dest = {};
            cloneObject(src, dest);
        }
        return dest;
    },

    /**
     * 字符串转Unicode编码数据
     * 【To be deprecated】
     * @method strToUnicodeArray
     * @param str {string} 可为中英文混合字符
     * @param gt255 {string} 是否含中文字符
     * @returns {Uint8Array}
     */
    strToUnicodeArray:function (str,gt255) {
        gt255 = typeof gt255 == 'undefined'?true:gt255;
        var buf = new ArrayBuffer(gt255?str.length * 2:str.length);
        var bufView = new Uint8Array(buf);
        for (var i = 0,j = 0, strlen = str.length; i < strlen; i++,j+=2) {
            var code = str.charCodeAt(i);
            if(gt255){
                if(code>255){
                    var hex = code.toString(16);
                    bufView[j] = parseInt(hex.slice(0,2),16);
                    bufView[j+1] = parseInt(hex.slice(2),16);
                }
                else{
                    bufView[j] = 0;
                    bufView[j+1] = code;
                }
            }
            else
                bufView[i] = code;
        }
        return bufView;
    },

    /**
     * 字符串转Unicode编码数据(UTF-8编码)
     * @method strToUnicode
     * @param str {string} 可为中英文混合字符
     * @returns {Uint8Array}
     */
    strToUnicode:function (str) {
        var buf = [];
        for (var i = 0,j = 0, strlen = str.length; i < strlen; i++,j++) {
            var code = str.charCodeAt(i);
            if(code>255){
                var hex = encodeURIComponent(str[i]).split('%');
                for(var m=1;m<hex.length;m++){
                    buf[j+m-1] = parseInt(hex[m],16);
                }
                j+=hex.length-2;
            }
            else
                buf[j] = code;
        }
        return new Uint8Array(buf);
    },

    getValueByField:function (data,fieldName,dataField) {
        if(dataField){
            var idx_value = dataField.indexOf(fieldName);
            return idx_value==-1?'':data[idx_value];
        }
        else
            return data[fieldName];
    },

    /**
     * 获取第一条有效数据
     * @param data
     * @param fieldName
     * @returns {*}
     */
    getFirstValidData:function (data,fieldName) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var value = item[fieldName];
            if (value !== null && value !== '')
                return data[i];
        }
        return null;
    },
    /**
     * 获取第一条有效数据的时间
     * @param source
     * @param valueField
     * @param isRange
     * @returns {*}
     */
    getDataTime: function (source,valueField,isRange) {
        var data = source.FieldName?source.Rows:source;
        if(data.length>0){
            var item = Sun.Util.Data.getFirstValidData(data,valueField,source.FieldName);
            if(item){
                valueField = valueField.slice(0,valueField.lastIndexOf('_')+1);
                if(isRange)
                    return [new Date(Sun.Util.Data.getValueByField(item,valueField+'BEGINTIME',source.FieldName).replace(/-/g, '/')),
                        new Date(Sun.Util.Data.getValueByField(item,valueField+'ENDTIME',source.FieldName).replace(/-/g, '/'))];
                else
                    return new Date(Sun.Util.Data.getValueByField(item,valueField+'HAPPENTIME',source.FieldName).replace(/-/g, '/'));
            }
        }
    },
    /**
     * 判断值是否在区间内
     * @param value {number} 被判断的值
     * @param minValue {number} 最小值
     * @param equalMin {Boolean} 是否等于最小值
     * @param maxValue {number} 最大值
     * @param equalMax {Boolean} 是否等于最大值
     */
    valueInRange:function(value,minValue,equalMin,maxValue,equalMax){
        var _inRange;
        if (isNaN(minValue) && isNaN(maxValue))
            return true;
        else if (isNaN(minValue)) {
            _inRange = value < maxValue;
            if (equalMax && value == maxValue)
                _inRange = true;
        }
        else if (isNaN(maxValue)) {
            _inRange = value > minValue;
            if (equalMin && value == minValue)
                _inRange = true;
        }
        else{
            _inRange = value < maxValue && value > minValue;
            if (equalMax && value == maxValue)
                _inRange = true;
            else if (equalMin && value == minValue)
                _inRange = true;
        }
        return _inRange;
    },

    /**
     * 将值数据转为Object数组
     * 将returntype=5得到的数据转为returntype=4的数据
     * @method changeValueArrayToObjectArray
     * @param data {Array}
     * @returns {*}
     */
    changeValueArrayToObjectArray:function (data) {
        if(data.FieldName){
            var rows = data.Rows;
            var newData = [];
            for(var i=0;i<rows.length;i++){
                var item = rows[i];
                var newItem = {};
                for(var j=0;j<data.FieldName.length;j++){
                    var field = data.FieldName[j];
                    newItem[field] = item[j];
                }
                newData.push(newItem);
            }
            return newData;
        }
        else
            return data;
    },

    /**
     * nc各个版本属性
     * 属性重新对应原因:
     *      1. 数据组过来的属性均为字符串，做一下数值上的类型转换，方便后续使用
     *      2. 之前已有数据(如之前的json数据)和nc命名不一致，为了保证命名一致
     */
    ncAttr : {
        '1.0' : {
            attribute:[
                {name:'title',field:'DataTitle'},
                {name:'symbol',field:'Symbol'},
                {name:'units',field:'Units'},
                {name:'elementCode',field:'ElementCode'},
                {name:'precision',field:'Precision',typeFun:parseFloat},
                {name:'invalidValue',field:'MissingValue',typeFun:parseFloat},
                {name:'latsize',field:'LatNum',typeFun:parseFloat},
                {name:'lonsize',field:'LonNum',typeFun:parseFloat},
                {name:'startlat',field:'StartLat',typeFun:parseFloat},
                {name:'startlon',field:'StartLon',typeFun:parseFloat},
                {name:'endlat',field:'EndLat',typeFun:parseFloat},
                {name:'endlon',field:'EndLon',typeFun:parseFloat},
                {name:'nlat',field:'LatInterval',typeFun:parseFloat},
                {name:'nlon',field:'LonInterval',typeFun:parseFloat}
            ]
        },
        '2.0' : {
            attribute:[
                {name:'title',field:'DataTitle'},
                {name:'elementCodes',field:'ElementCode'},
                {name:'precision',field:'Precision',typeFun:parseFloat},
                {name:'invalidValue',field:'MissingValue',typeFun:parseFloat}
            ],
            itemAttribute:[
                {name:'units',field:'Units'},
                {name:'latsize',field:'LatNum',typeFun:parseFloat},
                {name:'lonsize',field:'LonNum',typeFun:parseFloat},
                {name:'startlat',field:'StartLat',typeFun:parseFloat},
                {name:'startlon',field:'StartLon',typeFun:parseFloat},
                {name:'endlat',field:'EndLat',typeFun:parseFloat},
                {name:'endlon',field:'EndLon',typeFun:parseFloat},
                {name:'nlat',field:'LatInterval',typeFun:parseFloat},
                {name:'nlon',field:'LonInterval',typeFun:parseFloat},
                {name:'fixedValue',field:'FixedValue',typeFun:parseFloat},
                {name:'dataLevel',field:'DataLevel',typeFun:parseInt},
                {name:'dataChanged',field:'DataChange',typeFun:parseInt},
                {name:'showLand',field:'ShowLand',typeFun:parseInt},
                {name:'showStyle',field:'ShowStyle',typeFun:parseInt}
            ]
        },
        '3.0' : {
            attribute:[
                {name:'title',field:'DataTitle'},
                {name:'elementCodes',field:'ElementCode'},
                {name:'forecastTime',field:'ForecastTime'},
                {name:'invalidValue',field:'MissingValue',typeFun:parseFloat}
            ],
            itemAttribute:[
                {name:'units',field:'Units'},
                {name:'precision',field:'Precision',typeFun:parseFloat},
                {name:'xSize',field:'XNum',typeFun:parseFloat},
                {name:'ySize',field:'YNum',typeFun:parseFloat}
            ]
        }
    },
    /**
     * 将网格nc数据转为json
     * @method changeGridNcToJson
     * @param nc {Uint8Array|Sun.NCReader} nc数据/ncReader
     * @param windType {String} 'speed' 若数据为uv数据且该字段传speed，则会将uv转为speed传出
     * @returns {{}}
     */
    changeGridNcToJson:function (nc,windType) {
        var ncReader = nc instanceof Sun.NCReader ? nc : new Sun.NCReader(nc);
        var data = {};
        data.version = ncReader.getAttribute('Version');
        data.version = data.version || '1.0';
        var attr = Sun.Util.Data.ncAttr[data.version];
        data.version==='1.0'?setData1():setData2();
        return data;

        function setAttribute(data,attribute,code) {
            attribute.forEach(function (item) {
                var value = code?ncReader.getVariableAttribute(code,item.field):ncReader.getAttribute(item.field);
                data[item.name] = item.typeFun ? item.typeFun(value) : value;
            })
        }
        function setData1() {
            setAttribute(data,attr.attribute);
            data.data = getData(data.elementCode,data.precision);
        }
        function setData2() {
            setAttribute(data,attr.attribute);
            var eleCodes = data.elementCodes = data.elementCodes.split(',');
            data.data = {};
            for(var i=0;i<eleCodes.length;i++){
                var code = eleCodes[i];
                var isWind = code.indexOf('uv') !== -1;
                var _code = isWind ? code.replace('uv','u') : code;
                var item = {};
                setAttribute(item,attr.itemAttribute,_code);
                //Tip:版本2、版本3一个精度在外层属性一个在内部属性
                if(!item.precision) item.precision = data.precision;
                item.invalidValue = data.invalidValue;
                item.elementCode = code;
                item.data = getData(code,item.precision);
                data.data[code] = item;
            }

            if(data.version === '3.0'){
                // Tip:版本3为剖面所用，需要坐标轴信息
                data.xaxis = ncReader.getDataVariable('XAxis',data.precision);
                // data.xaxis = ncReader.getDataVariable('XTime',data.precision);
                data.yaxis = ncReader.getDataVariable('YAxis',data.precision);
                data.yaxis_uv = ncReader.getDataVariable('YUV',data.precision);
                data.hpa_km = [
                    ncReader.getDataVariable('YhPa',data.precision),
                    ncReader.getDataVariable('YKm',data.precision)
                ]
            }
        }

        function getData(varName,precision) {
            var varData;
            if(varName.indexOf('uv') !== -1){
                varData=[];
                varData[0] = ncReader.getDataVariable(varName.replace('uv','u'),precision);
                varData[1] = ncReader.getDataVariable(varName.replace('uv','v'),precision);
                if(windType === 'speed'){
                    var speed = [];
                    for(var i=0;i<data.data[0].length;i++){
                        var s = Sun.Util.Weather.wind_getWindByUV([data.data[0][i],data.data[1][i]]).speed;
                        speed.push(s);
                    }
                    varData = speed;
                }
            }
            else
                varData = ncReader.getDataVariable(varName,precision);
            return varData;
        }
    },

    /**
     * 将micaps文件数据转为json
     * @param micaps {string}
     */
    changeMicapsToJson:function (micaps) {
        micaps = micaps.replace(/[\n\r]/g, '');
        micaps = micaps.split(' ');
        var data = [];
        for (var i = 0; i < micaps.length; i++) {
            if (micaps[i] != '')
                data.push(micaps[i]);
        }

        var micapsType = data[1];
        var attr = ['micapsType', 'title', 'year', 'month', 'day', 'hour', 'timeSession', 'layer', 'nlon', 'nlat', 'startlon', 'endlon',
            'startlat', 'endlat', 'latsize', 'lonsize'];
        if (micapsType == '4')
            attr = attr.concat(['isoGap', 'isoStart', 'isoEnd', 'smooth', 'boldWeight']);
        var json = {}, idx = 1;
        for (i = 0; i < attr.length; i++, idx++) {
            json[attr[i]] = attr[i]=='title'?data[idx]:parseFloat(data[idx]);
        }
        if (micapsType == '4') {//4类文件
            for (json.data = []; idx < data.length; idx++) {
                json.data.push(data[idx]);
            }
        }
        else if (micapsType == '11') {//11类文件
            var size = idx + json.latsize * json.lonsize;
            for (json.data = [[], []]; idx < data.length; idx++) {
                idx < size ? json.data[0].push(data[idx]) : json.data[1].push(data[idx]);
            }
        }

        return json;
    }
};


/**
 * Math工具
 *
 * Features :
 *      1. (四舍五入)保留N位小数
 *      2. 获取两个值之间的随机数
 *
 * Update Note：
 *      + v1.0.0 ：Created
 *      + v1.0.5 ：增加四舍五入保留N位小数
 *
 * @class Sun.Util.Math
 */
Sun.Util.Math={
    /**
     * 获取两个值之间的随机数
     * @method random
     * @param min {number} 最小值
     * @param max {number} 最大值
     * @returns {number}
     */
    random : function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    },

    dotNum : function (value) {
        value = String(value);
        var start = value.indexOf('.');
        return start == -1 ? 0 : value.substring(start + 1).length;
    },
    /**
     * 保留N位小数
     * @method toFixed
     * @param value
     * @param num
     * @returns {*|string}
     */
    toFixed : function (value, num) {
        return Sun.Util.Math.dotNum(value) > num ? value.toFixed(num) : value;
    },

    /**
     * 四舍五入保留保留N位小数
     * @method toRoundFixed
     * @param value
     * @param num
     * @returns {*}
     */
    toRoundFixed : function (value,num) {
        if(Sun.Util.Math.dotNum(value) > num){
            value = value * 10 * num;
            value = Math.round(value);
            value = value / (10 * num);
        }
        return value;
    }
};


/**
 * 气象数据工具
 *
 * Features :
 *      1. 工具类，相当于静态方法，无需实例直接调用
 *      2. 水位数据处理
 *      3. uv分量转风向风速
 *
 * Update Note：
 *      + v1.0.8 ：Created(transfer from LW.Util.Weather)
 *      + v1.0.9 ：1. 增加根据风速计算风力
 *                 2. 增加根据天气现象code获取天气现象描述
 *
 * @class Sun.Util.Weather
 */
Sun.Util.Weather = {


    /**
     * 水位状态：无，上涨，下跌，持平，正常，超汛线，超保证
     * @type {{NONE: string, UP: string, DOWN: string, EQUAL: string, NORMAL: string, SUPER_LIMITED: string, SUPER_WARRANTY: string}}
     */
    WaterlevelStatus : {
        NONE: 'none', UP: 'up', DOWN: 'down', EQUAL: 'equal',
        NORMAL: 'normal', SUPER_LIMITED: 'superLimited', SUPER_WARRANTY: 'superWarranty'
    },

    /**
     * 获得水位(超汛线、超保证、正常)状态
     * @param data
     * @returns {string}
     */
    waterLevel_getLimitStatus : function (data) {
        var value = parseFloat(data.WATERLEVEL_CURRENT_VALUE);
        if (data.STATIONTYPE == 1) {
            if (isNaN(value) || isNaN(data.LIMITEDLEVEL))
                return Sun.Util.Weather.WaterlevelStatus.NONE;
            if (value > data.LIMITEDLEVEL)
                return Sun.Util.Weather.WaterlevelStatus.SUPER_LIMITED;
            else
                return Sun.Util.Weather.WaterlevelStatus.NORMAL;
        }
        else if (data.STATIONTYPE == 3) {
            if (isNaN(value) || isNaN(data.ENSURELEVEL))
                return Sun.Util.Weather.WaterlevelStatus.NONE;
            if (value > data.ENSURELEVEL)
                return Sun.Util.Weather.WaterlevelStatus.SUPER_WARRANTY;
            else
                return Sun.Util.Weather.WaterlevelStatus.NORMAL;
        }
        else
            return Sun.Util.Weather.WaterlevelStatus.NONE;
    },

    /**
     * 获得水位(涨、跌、持平)状态
     * @param currentData
     * @param historyData
     * @returns {string}
     */
    waterLevel_getChangedStatus : function (currentData, historyData) {
        if (!historyData || !currentData)
            return Sun.Util.Weather.WaterlevelStatus.NONE;
        var r1 = parseFloat(historyData.WATERLEVEL_CURRENT_VALUE);
        var r2 = parseFloat(currentData.WATERLEVEL_CURRENT_VALUE);

        if (!isNaN(r1) && !isNaN(r2)) {
            if (r1 > r2)
                return Sun.Util.Weather.WaterlevelStatus.DOWN;
            else if (r1 < r2)
                return Sun.Util.Weather.WaterlevelStatus.UP;
            else
                return Sun.Util.Weather.WaterlevelStatus.EQUAL;
        }
        else
            return Sun.Util.Weather.WaterlevelStatus.NONE;
    },

    /**
     * uv分量转风向风速
     * @method wind_getWindByUV
     * @param uvValue
     * @param precision {int} 默认为2
     * @returns {{speed: *, dir: *}}
     */
    wind_getWindByUV: function (uvValue,precision) {
        precision = precision || 1;
        var u = uvValue[0];
        var v = uvValue[1];
        var speed = Sun.Util.Math.toRoundFixed(Math.sqrt(u * u + v * v), precision);
        var dir;
        if (u == 0)
            dir = v < 0 ? 0 : 180;
        else {
            dir = Math.atan(v / u) / Math.PI * 180;
            dir = u > 0 ? (270 - dir) : (90 - dir);
        }
        return {speed: speed, dir: dir};
    },

    /**
     * 风向风速转uv分量
     * @param speed
     * @param dir
     * @param returnType {int} 0--{u: number, v: number}; 1--[u,v]
     * @param precision {int} 默认为2
     * @returns
     */
    wind_getUVByWind: function (speed,dir,returnType,precision) {
        precision = precision || 1;
        var tmp = (270-dir) * Math.PI / 180;
        var u = Sun.Util.Math.toRoundFixed(speed * Math.cos(tmp),precision);
        var v = Sun.Util.Math.toRoundFixed(speed * Math.sin(tmp),precision);
        returnType = returnType || 0;
        return returnType === 0 ? {u:u,v:v} : [u,v];
    },

    windPower:[0,0.2,1.5,3.3,5.4,7.9,10.7,13.8,17.1,20.7,24.4,28.4,32.6,36.9,41.4,46.1,50.9,56,61.2],
    
    wind_getWindPower:function (speed) {
        var windp = Sun.Util.Weather.windPower;
        var lastIdx = windp.length-1;
        for(var i=0;i<lastIdx;i++){
            var p1 = windp[i],p2 = windp[i+1];
            var condition = i===0 ? (speed >= p1 && speed <= p2) : speed > p1 && speed <= p2;
            if(condition) return i;
        }
        if(speed>windp[lastIdx])
            return lastIdx;
    },

    wpData:[
        {code:0,desc:'晴'},{code:1,desc:'多云'},{code:2,desc:'阴'},{code:4,desc:'雷阵雨'},{code:5,desc:'雷阵雨并伴有冰雹'},
        {code:6,desc:'雨夹雪'},{code:7,desc:'小雨'},{code:8,desc:'中雨'},{code:9,desc:'大雨'},{code:10,desc:'暴雨'},
        {code:11,desc:'大暴雨'},{code:12,desc:'特大暴雨'},{code:14,desc:'小雪'},{code:15,desc:'中雪'},{code:16,desc:'大雪'},
        {code:17,desc:'暴雪'},{code:18,desc:'雾'},{code:19,desc:'冻雨'},{code:20,desc:'沙尘暴'},{code:30,desc:'扬沙或浮尘'},
        {code:31,desc:'强沙尘暴'},{code:53,desc:'霾'}
    ],
    /**
     * 根据code获取天气现象描述
     * @param code
     */
    wp_getDescByCode:function (code) {
        var item = Sun.Util.Array.getItemByField(Sun.Util.Weather.wpData,'code',code);
        return item ? item.desc : '';
    }
};


Sun.Util.Layout = {
    center : function (target, targetWidth, targetHeight) {
        target.style.position = 'absolute';
        target.style.left = (targetWidth - parseFloat(target.width)) / 2 + 'px';
        target.style.top = (targetHeight - parseFloat(target.height)) / 2 + 'px';
    }
};
/**
 * @module Util
 */

/**
 * 几何工具
 *
 * Features :
 *      1. 绘制风向杆
 *      2. 判断点和多边形关系，多边形之间的关系
 *      3. 获取多边形的buffer
 *      注：部分方法需要用到Leaflet.js,之后会尽量脱离
 *
 * Update Note：
 *     + v1.0.8 ：Created(transfer from LW.Util.Weather)
 *     + v1.0.18 ：1. 增加绘制带箭头的提示框方法drawTooltip
 *                 2. 增加计算点和圆的切线的方法tangent
 *                 3. 增加计算两个圆的公切线的方法publicTangent
 *
 * @class Sun.Util.Geometry
 */
Sun.Util.Geometry = {

    /**
     * 绘制风向杆
     *
     * 绘制于画布中央
     * @method drawWind
     * @param ctx {CanvasRenderingContext2D}
     * @param windSpeed {number} 风速
     * @param windDir {number} 风向
     * @param w {number} 画布长度
     * @param h {number} 画布宽度
     * @param fill {boolean} 风杆三角形部分是否填色
     * @param vaneLength {number} 风杆长度
     * @param xWidth {number} 风杆宽度
     *
     */
    drawWind: function (ctx, windSpeed, windDir, w, h, fill, vaneLength, xWidth) {
        if (!ctx) return;
        if(windSpeed!=null && windSpeed>0){
            var y = h / 2;
            vaneLength = vaneLength || 25;
            xWidth = xWidth || 8;

            ctx.translate(w / 2, h / 2);
            ctx.rotate(windDir * Math.PI / 180);
            ctx.translate(-w / 2, -h / 2);

            ctx.beginPath();
            ctx.moveTo(w / 2, y);
            ctx.lineTo(w / 2, y - vaneLength);

            var center = w / 2;

            //var spd = 4 * Math.round(windSpeed / 4);
            var wholeLines = Math.floor(windSpeed / 4);
            var halfLine = ((windSpeed % 4) > 0);

            var carriage = vaneLength;
            var interval = xWidth / 2;
            var _wholeLines = wholeLines;
            var xShift = xWidth;
            var yShift = xShift * Math.tan(30 * Math.PI / 180);
            for (var i = 0; i < wholeLines; i++) {
                ctx.moveTo(center, y - carriage);
                if (_wholeLines >= 5) {
                    ctx.lineTo(center + xShift, y - carriage);
                    ctx.lineTo(center, y - carriage + yShift);
                    if (fill)
                        ctx.fill();
                    i += 4;
                    _wholeLines -= 5;
                    carriage -= (_wholeLines>=5 ? yShift : 2*yShift);
                } else {
                    ctx.lineTo(center + xShift, y - carriage - yShift);
                    carriage -= interval;
                }

            }

            if (halfLine) {
                if (wholeLines == 0) carriage -= interval;
                ctx.moveTo(center, y - carriage);
                ctx.lineTo(center + xShift / 2 + 1, y - carriage - yShift / 2);
            }

            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    },

    /**
     * 在指定位置上绘制风杆
     * @method drawWindByPosition
     * @param ctx {CanvasRenderingContext2D}
     * @param windSpeed {number} 风速
     * @param windDir {number} 风向
     * @param p {object} 绘制位置
     * @param fill {boolean} 风杆三角形部分是否填色
     * @param vaneLength {number} 风杆长度
     * @param xWidth {number} 风杆宽度
     */
    drawWindByPosition: function (ctx, windSpeed, windDir, p, fill, vaneLength, xWidth) {
        if (!ctx) return;
        if(windSpeed!=null && windSpeed>0) {
            var x = p.x;
            var y = p.y;
            fill = fill || false;
            vaneLength = vaneLength || 25;
            xWidth = xWidth || 8;

            ctx.translate(x, y);
            ctx.rotate(windDir * Math.PI / 180);
            ctx.translate(-x, -y);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - vaneLength);

            //var spd = 4 * Math.round(windSpeed / 4);
            var wholeLines = Math.floor(windSpeed / 4);
            var halfLine = ((windSpeed % 4) > 0);

            var carriage = vaneLength;
            var interval = xWidth / 2;
            var _wholeLines = wholeLines;
            var xShift = xWidth;
            var yShift = xShift * Math.tan(30 * Math.PI / 180);
            for (var i = 0; i < wholeLines; i++) {
                ctx.moveTo(x, y - carriage);
                if (_wholeLines >= 5) {
                    ctx.lineTo(x + xShift, y - carriage);
                    ctx.lineTo(x, y - carriage + yShift);
                    if (fill)
                        ctx.fill();
                    i += 4;
                    _wholeLines -= 5;
                    carriage -= (_wholeLines>=5 ? yShift : 2*yShift);
                } else {
                    ctx.lineTo(x + xShift, y - carriage - yShift);
                    carriage -= interval;
                }

            }

            if (halfLine) {
                if (wholeLines == 0) carriage -= interval;
                ctx.moveTo(x, y - carriage);
                ctx.lineTo(x + xShift / 2 + 1, y - carriage - yShift / 2);
            }

            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    },

    drawArrow:function (ctx, p, dir, vaneLength,theta,headlen,width,color) {
        vaneLength = typeof(vaneLength) != 'undefined' ? vaneLength : 25;
        var p2 = {x:p.x,y:p.y-vaneLength};
        ctx.translate(p.x, p.y);
        ctx.rotate(dir * Math.PI / 180);
        ctx.translate(-p.x, -p.y);
        Sun.Util.Geometry.drawArrowByXY(ctx,p.x,p.y,p2.x,p2.y,theta,headlen,width,color);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    },

    drawArrowByXY: function (ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
        theta = typeof(theta) != 'undefined' ? theta : 30;
        headlen = typeof(headlen) != 'undefined' ? headlen : 5;
        width = typeof(width) != 'undefined' ? width : 1;
        color = typeof(color) != 'undefined' ? color : '#000';

        // 计算各角度和对应的P2,P3坐标
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);


        ctx.save();
        ctx.beginPath();

        var arrowX = fromX - topX,
            arrowY = fromY - topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        arrowX = toX + topX;
        arrowY = toY + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(toX, toY);
        arrowX = toX + botX;
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
    },

    drawRoundRect:function (ctx, x, y, width, height, radius){
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        ctx.lineTo(width - radius + x, y);
        ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
        ctx.lineTo(width + x, height + y - radius);
        ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2);
        ctx.lineTo(radius + x, height +y);
        ctx.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI);
        ctx.closePath();
    },

    /**
     * 绘制带箭头的提示框,基于canvas
     * @param ctx
     * @param x
     * @param y
     * @param width
     * @param height
     * @param radius
     * @param vertex {object} 顶点坐标。eg:{x:0,y:0}
     * @param direction {string} 箭头方向。left/right/top/bottom
     * @param gap {number} 箭头间隔
     */
    drawTooltip:function(ctx, x, y, width, height,radius, vertex,direction,gap) {
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
        if(direction == 'top')
            drawArrow({x:x+width/2-gap,y:y},{x:x+width/2+gap,y:y});
        ctx.lineTo(width - radius + x, y);

        ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
        if(direction == 'right')
            drawArrow({x:width + x,y:y+height/2-gap},{x:width + x,y:y+height/2+gap});
        ctx.lineTo(width + x, height + y - radius);

        ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2);
        if(direction == 'bottom')
            drawArrow({x:x+width/2+gap,y:height +y},{x:x+width/2-gap,y:height +y});
        ctx.lineTo(radius + x, height +y);

        ctx.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI);
        if(direction == 'left')
            drawArrow({x:x,y:y+height/2+gap},{x:x,y:y+height/2-gap});
        ctx.closePath();

        function drawArrow(p1,p2){
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(vertex.x,vertex.y);
            ctx.lineTo(p2.x,p2.y);
        }
    },

    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param vertex
     * @param direction
     * @param gap
     */
    getTooltipPath:function(x, y, width, height,vertex,direction,gap){
        var points = [{x:x,y:y}];
        if(direction == 'top')
            setArrowPoint({x:x+width/2-gap,y:y},{x:x+width/2+gap,y:y});
        points.push({x:width + x, y:y});

        if(direction == 'right')
            setArrowPoint({x:width + x,y:y+height/2-gap},{x:width + x,y:y+height/2+gap});
        points.push({x:width + x, y:height + y});

        if(direction == 'bottom')
            setArrowPoint({x:x+width/2+gap,y:height +y},{x:x+width/2-gap,y:height +y});
        points.push({x:x, y:height +y});

        if(direction == 'left')
            setArrowPoint({x:x,y:y+height/2+gap},{x:x,y:y+height/2-gap});

        return points;

        function setArrowPoint(p1,p2){
            points.push({x:p1.x, y:p1.y});
            points.push({x:vertex.x,y:vertex.y});
            points.push({x:p2.x,y:p2.y});
        }
    },

    /**
     * 计算圆的切点
     * @param p {Array} 计算切线的点 eg:[lng,lat]/[x,y]
     * @param p_circle {Array} 圆心的位置 eg:[lng,lat]/[x,y]
     * @param radius {number} 圆的半径,单位：km
     * @return {*}
     */
    tangent: function(p, p_circle, radius){
        var circle = turf.circle(p_circle, radius, 64, 'kilometers');
        var t = turf.polygonTangents(turf.point(p), circle);
        return [t.features[0].geometry.coordinates,t.features[1].geometry.coordinates]
    },

    /**
     * 计算两个圆的公切线
     * @param p1 {Array} 圆1的圆心 eg:[lng,lat]/[x,y]
     * @param r1 {number} 圆1的半径,单位：km
     * @param p2 {Array} 圆2的圆心 eg:[lng,lat]/[x,y]
     * @param r2 {number} 圆2的半径,单位：km  圆2的半径需大于圆1的半径
     * @return {*[]}
     */
    publicTangent: function(p1,r1,p2,r2){
        var circle2_1 = turf.circle(p2, r2-r1 ,64, 'kilometers');
        var midpoint = turf.midpoint(p1, p2);
        var d = turf.distance(midpoint,p2,'kilometers');
        var midCircle = turf.circle(midpoint, d,64, 'kilometers');
        var intersects = turf.lineIntersect(turf.polygonToLineString(midCircle),turf.polygonToLineString(circle2_1));
        var i1 = intersects.features[0].geometry.coordinates;
        var i2 = intersects.features[1].geometry.coordinates;
        var b1 = turf.bearing(p1,i1);
        var b2 = turf.bearing(p1,i2);
        var tangent1 = turf.lineOffset(turf.lineString([p1,i1]),r1*(b1>b2?1:-1));
        var tangent2 = turf.lineOffset(turf.lineString([p1,i2]),r1*(b1>b2?-1:1));
        return [tangent1,tangent2];
    },

    /**
     * 判断点是否在多边形内【坐标/经纬数组】
     * @method pointInPolygon
     * @param x {number} x
     * @param y {number} y
     * @param polyCoords {Array} 多边形的坐标
     * @returns {boolean}
     */
    pointInPolygon: function (x, y, polyCoords) {
        var inside = false,
            intersects, i, j;

        for (i = 0, j = polyCoords.length - 1; i < polyCoords.length; j = i++) {
            var xi = polyCoords[i][0], yi = polyCoords[i][1];
            var xj = polyCoords[j][0], yj = polyCoords[j][1];

            intersects = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersects) {
                inside = !inside;
            }
        }

        return inside;
    },

    /**
     * 判断点是否在多边形内【经纬度】
     * @method latlngInPolygon
     * @param l {L.Latlng} 经纬度
     * @param latlngs {Array} 多边形的经纬集 eg:[L.latlng,L.latlng..]
     * @param bounds {L.LatLngBounds} 经纬度
     * @returns {boolean}
     */
    latlngInPolygon: function (l, latlngs, bounds) {
        var inside = false, l1, l2, j, k, len2,inBounds = true;

        if(bounds)
            inBounds = bounds.contains(l);

        if(inBounds){
            for (j = 0, len2 = latlngs.length, k = len2 - 1; j < len2; k = j++) {
                l1 = latlngs[j];
                l2 = latlngs[k];

                if (((l1.lat > l.lat) !== (l2.lat > l.lat)) &&
                    (l.lng < (l2.lng - l1.lng) * (l.lat - l1.lat) / (l2.lat - l1.lat) + l1.lng)) {
                    inside = !inside;
                }
            }

            return inside;
        }
        else
            return false;

    },


    /**
     * 判断多边形1是否在多边形2中，需引用turf4.7.3以上
     * @param polygon1
     * @param polygon2
     */
    polygon1InPolygon2:function (polygon1,polygon2) {
        var poly1 = Sun.Util.Geometry.toTurfPolygon(polygon1);
        var poly2 = Sun.Util.Geometry.toTurfPolygon(polygon2);
        return turf.booleanContains(poly2, poly1);
    },

    /**
     * 判断多边形1和多边形2是否有重叠部分，需引用turf4.7.3以上
     * @param polygon1
     * @param polygon2
     * @returns {*}
     */
    polygon1OverlapPolygon2:function (polygon1,polygon2) {
        var poly1 = Sun.Util.Geometry.toTurfPolygon(polygon1);
        var poly2 = Sun.Util.Geometry.toTurfPolygon(polygon2);
        return turf.booleanOverlap(poly1, poly2);
    },

    toTurfPolygon:function (polygon) {
        if(polygon.length>2){
            var poly = polygon.map(function (item) {
                return getItem(item);
            });
            poly.push(getItem(polygon[0]));
            return turf.polygon([poly]);
        }

        function getItem(item) {
            return item instanceof L.LatLng ? [item.lng,item.lat] : [item[1],item[0]]
        }
    },

    getPointPidOfRings:function (latlng,roots,rings) {
        var pid = -1;
        for (var i = 0; i < roots.length; i++){
            setPointPid(roots[i]);
        }
        return pid;

        function setPointPid(line) {
            if (Sun.Util.Geometry.pointInPolygon(latlng.lat,latlng.lng, line.pointitems)) {
                // 点在line圈内
                if(line.cid &&　line.cid.length>0){
                    // 判断点是否在line子圈内
                    for(var i=0;i<line.cid.length;i++){
                        var cid = line.cid[i];
                        if(typeof cid == 'number'){
                            var line2 = rings[cid];
                            setPointPid(line2);
                        }
                    }
                    if(pid===-1)
                        pid = line.id;
                }
                else
                    pid = line.id;
            }
        }

    },

    /**
     * 获取多边形内的网格
     * @param data {Object} 网格数据
     * @param grid {Array} 网格模型
     * @param polygon {Array} 多边形
     * @param type {string} 获取的网格类型 value--网格值/index--网格在网格模型中的索引
     * @returns {Array}
     */
    getGridsInPolygon: function (data,grid,polygon,type) {
        var bounds = new L.LatLngBounds(),grids=[];
        for (var i = 0; i < polygon.length; i++) {
            bounds.extend(polygon[i]);
        }
        var fn = Sun.Util.Geometry.latlngInPolygon;
        var x0 = parseFloat(data.startlon), y0 = parseFloat(data.startlat);
        var x1 = parseFloat(data.endlon), y1 = parseFloat(data.endlat);
        var allIn = fn({lat:y0,lng:x0},polygon) && fn({lat:y1,lng:x0},polygon)
            && fn({lat:y0,lng:x1},polygon) && fn({lat:y1,lng:x1},polygon);
        if(allIn)
            return 'all';
        else
            return Sun.Util.Geometry._getGridInPath(data,grid,bounds,type,function (latlng) {
                return Sun.Util.Geometry.latlngInPolygon(latlng, polygon);
            });
    },

    /**
     * 获取在圆中的网格
     * @method getGridInCircle
     * @param data {Object} 网格数据
     * @param grid {Array} 网格模型
     * @param bounds {L.LatLngBounds} 边界
     * @param center {L.LatLng|Array.<number>} 圆的中心点
     * @param radius {number} 圆的半径，单位：米
     * @param type {string} 获取的网格类型 value--网格值/index--网格在网格模型中的索引
     * @returns {*}
     */
    getGridInCircle: function (data,grid,bounds,center,radius,type) {
        return Sun.Util.Geometry._getGridInPath(data,grid,bounds,type,function (latlng) {
            return latlng.distanceTo(center)<radius;
        });
    },

    getGridInBounds: function (data,grid,bounds,type) {
        return Sun.Util.Geometry._getGridInPath(data,grid,bounds,type,function () {return true;});
    },

    _getGridInPath:function (data,grid,bounds,type,inPathFun) {
        var grids = [];
        if (data && grid) {
            var xSize = parseFloat(data.lonsize), ySize = parseFloat(data.latsize);
            var x0 = parseFloat(data.startlon), y0 = parseFloat(data.startlat);
            var dx = parseFloat(data.nlon), dy = parseFloat(data.nlat);
            var sx = Math.ceil((bounds.getWest() - x0) / dx);
            var sy = Math.ceil((bounds.getNorth() - y0) / dy);
            var ex = Math.ceil((bounds.getEast() - x0) / dx);
            var ey = Math.ceil((bounds.getSouth() - y0) / dy);
            sx = sx<0?0:sx;
            var sy_fix = Math.min(sy,ey);
            var ey_fix = Math.max(sy,ey);
            for (var row = sy_fix; row < ey_fix; row++) {
                var _row = grid[row];
                for (var column = sx; column < ex; column++) {
                    if(row<ySize && column<xSize) {
                        var latLng = L.latLng(y0 + dy * row, x0 + dx * column);
                        if (inPathFun(latLng)) {
                            if (type == 'value')
                                grids.push(_row[column]);
                            else if (row < grid.length && _row && column < _row.length)
                                grids.push(row + '_' + column);
                        }
                    }
                }
            }
        }
        return grids;
    },


    /**
     * 获取垂点
     * @param p1
     * @param p2
     * @param p
     * @returns {*}
     */
    getVerticalPoint: function (p1,p2,p) {
        var d = p1.distanceTo(p2);
        if(d<0.001)
            return p1;
        else{
            var r = Sun.Util.Geometry.innerProductOfVector(p2, p, p1);
            if (r < 0) // p0在p1p2的p1外部
                return p1;
            else if (r / d > 1)// p0在p1p2的p2外部
                return p2;
            else{
                var a = p2.y - p1.y;
                var b = p1.x - p2.x;
                var c = p1.y * p2.x - p1.x * p2.y;
                var x = (b * b * p.x - a * b * p.y - a * c) / (a * a + b * b);
                var y = (a * a * p.y - a * b * p.x - b * c) / (a * a + b * b);

                return {x:x,y:y};
            }
        }
    },
    /**
     * 获取点到折线最短距离
     * @param p {L.Point}
     * @param line {Array<L.Point>}
     */
    getMinDistance: function (p,line) {
        var min = 100,crossP,m_idx=-1;
        for (var i = 1; i < line.length; i++){
            var p1 = line[i], p2 = line[i-1];
            var d;
            var cp = p1;
            if (i > 0 && (valueInRange(p1.x, p2.x, p.x) >= 0 || valueInRange(p1.y, p2.y, p.y) >= 0))
                cp = Sun.Util.Geometry.getVerticalPoint(p1, p2, p);
            d = p.distanceTo(cp);
            if (d < min){
                m_idx = i;
                min = d;
                crossP = cp;
            }
        }
        return m_idx!=-1?{d:min,vPoint:crossP,range:[m_idx-1,m_idx]}:null;

        function valueInRange(a,b,c){
            return (c - a) * (b - c);
        }
    },

    /**
     * 计算点积(向量内积)(P1-P0)·(P2-P0)=|P0P1|*|P0P2|*cosP102
     * @param p
     * @param p1
     * @param p2
     * @return
     */
    innerProductOfVector:function (p,p1,p2) {
        // 物理含义为以(P0.P1)为力以及(P0.P2)为距离的功
        // 几何含义为(P0.P1)在（P0.P2）的投影（P0到垂点距离）与P0P2的乘积
        // 几何性质：
        // 值=0时代表，P0在以P1P2为直径的圆上；P2在P1P0的P0点垂直线上
        // 值>0时代表，P0在以P1P2为直径的圆外部；P2在P1P0的内部以及P1方向外部
        // 值<0时代表，P0在以P1P2为直径的圆内部；P2在P1P0的P0方向外部
        return (p1.x - p.x) * (p2.x - p.x) + (p1.y - p.y) * (p2.y - p.y);
    },

    /**
     * 获取角度
     * @param cen
     * @param p1
     * @param p2
     * @returns {number}
     */
    getAngel: function (cen,p1,p2) {
        var ma_x = p1.x - cen.x;
        var ma_y = p1.y - cen.y;
        var mb_x = p2.x - cen.x;
        var mb_y = p2.y - cen.y;
        var v1 = (ma_x * mb_x) + (ma_y * mb_y);
        var ma_val = Math.sqrt(ma_x * ma_x + ma_y * ma_y);
        var mb_val = Math.sqrt(mb_x * mb_x + mb_y * mb_y);
        var cosM = v1 / (ma_val * mb_val);
        return Math.acos(cosM) * 180 / Math.PI;
    },


    /**
     * 获取简化的边界外壳数据,需引用hull.js
     * @param geoData {Array} GeoJson 数据
     * @param center {L.LatLng} GeoJson的中心点,可用geo.getBounds().getCenter()获得
     * @param hullDegree {Number} 外壳简化程度 eg:0.5
     * @param distance {Number} 扩大距离 单位：米
     * @returns {*}
     */
    getExtendGeoData: function (geoData, center, hullDegree, distance) {
        var coords = geoData.features[0].geometry.coordinates;
        coords = Sun.Util.Array.merge(coords);
        var points = [];
        for (var i = 0; i < coords.length; i++) {
            var item = coords[i];
            var p = {lng: item[0], lat: item[1]};
            var d0 = center.distanceTo(p);
            var d1 = d0 + distance;
            var scale = d1 / d0;
            p.lat = scale * (p.lat - center.lat) + center.lat;
            p.lng = scale * (p.lng - center.lng) + center.lng;
            points.push(p);
        }

        return hull(points, hullDegree, ['.lng', '.lat']);
    },


    /**
     * 获取多边形的buffer,需引用jsts.js
     * @param geoData
     * @param distance  {Number} 扩大距离 单位：km
     * @returns {*}
     */
    getBuffer : function (geoData,distance) {
        var geometry = geoData.features[0].geometry;
        geometry.coordinates[0] = geometry.coordinates[0].map(function (item) {
            return [item[1],item[0]];
        });

        var reader = new jsts.io.GeoJSONReader();
        var writer = new jsts.io.GeoJSONWriter();

        var jstsGeom = reader.read(geometry);
        var buffered = jstsGeom.buffer(distance/100);
        buffered = writer.write(buffered);

        return buffered.coordinates;
    },

    /**
     * svg转图片src【需引用canvg】
     * @param svg {svg}
     * @param offsetX {number} x方向偏移
     * @param offsetY {number} y方向偏移
     * @param width {number} 截取的长度
     * @param height {number} 截取的宽度
     * @param legend 图例或其他图片 {img:img,x:0,y:0,width:40,height:40}
     * @returns {string}
     */
    svgToImgsrc: function (svg, offsetX, offsetY, width, height, legend) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvg(canvas, svg, {offsetX: offsetX, offsetY: offsetY});
        if (legend) {
            var ctx = canvas.getContext('2d');
            ctx.drawImage(legend.img, legend.x, legend.y, legend.width, legend.height);
        }
        return canvas.toDataURL("image/png");
    }
};


/**
 * 图例工具
 *
 * Features :
 *      1. 工具类，相当于静态方法，无需实例直接调用
 * Update Note：
 *      + v1.0.8 ：Created(transfer from LW.Util.LegendData)
 *      + v1.0.13 ：getColorOfRangeLegend增加defaultColor可外部设置的功能
 *      + v1.0.16 : getColorOfRangeLegend增加支持pattern填色color返回
 *
 * @class Sun.Util.LegendData
 */
Sun.Util.LegendData = {

    /**
     * 根据值获取范围图例数据的颜色
     * @method getColorOfRangeLegend
     * @param legendData
     * @param value
     * @param defaultColor
     * @returns {*}
     */
    getColorOfRangeLegend: function (legendData, value,defaultColor) {
        defaultColor = typeof defaultColor != 'undefined' ? defaultColor : '#ffffff';
        for (var i = 0; i < legendData.length; i++) {
            var item = legendData[i];
            if (isNaN(item.min) || item.min == null) {
                if (value < item.max || (item.equalMax && value == item.max))
                    return getColor(item);
            }
            else if (isNaN(item.max) || item.max == null) {
                if (value > item.min || (item.equalMin && value == item.min))
                    return getColor(item);
            }
            else {
                if ((value > item.min && value < item.max) || (item.equalMax && value == item.max) || (item.equalMin && value == item.min))
                    return getColor(item);
            }
        }
        return defaultColor;

        function getColor(item) {
            return item.id?'url(#'+item.id+')':item.color;
        }
    },

    /**
     *
     * 根据值获取值图例数据的颜色
     * @method getColor
     * @param legendData
     * @param value
     * @param defaultColor
     * @returns {*}
     */
    getColor: function (legendData, value, defaultColor) {
        defaultColor = defaultColor || '#fff';
        for (var i = 0; i < legendData.length; i++) {
            var item = legendData[i];
            if (value == item.value)
                return item.color;
        }
        return defaultColor;
    },

    /**
     * 获取图例数据的颜色
     * @method getColors
     * @param legendData
     * @returns {Array}
     */
    getColors: function (legendData) {
        var colors = [];
        for (var i = 0; i < legendData.length; i++) {
            colors.push(legendData[i].color);
        }
        return colors;
    },

    /**
     *
     * 根据值获取范围图例数据的颜色索引
     * @method getColorIndex
     * @param legendData
     * @param value
     * @returns {number}
     */
    getColorIndex: function (legendData, value) {
        for (var i = 0; i < legendData.length; i++) {
            var item = legendData[i];
            if (isNaN(item.min) || item.min == null) {
                if (value < item.max || (item.equalMax && value == item.max))
                    return i;
            }
            else if (isNaN(item.max) || item.max == null) {
                if (value > item.min || (item.equalMin && value == item.min))
                    return i;
            }
            else {
                if ((value > item.min && value < item.max) || (item.equalMax && value == item.max) || (item.equalMin && value == item.min))
                    return i;
            }
        }
        return -1;
    },

    /**
     * @method getColorSegments
     * @param legendData
     * @returns {*[]} [ [value, [r,g,b]] ]
     */

    getColorSegments: function (legendData,returnType) {
        var segments = [];
        returnType = returnType || 1;
        for (var i = 0; i < legendData.length; i++) {
            var item = legendData[i];
            var color = Sun.Util.Color.colorToRgb(item.color, 1);
            var nItem = returnType == 1 ? [item.min, color] :
                {min:item.min,max:item.max,equalMin:item.equalMin,equalMax:item.equalMax,color:color};
            segments.push(nItem);
        }
        return segments;
    }
};

/**
 * Grid工具,处理网格相关数据
 *
 * Features :
 *      1.计算面积比
 *      2.获取网格掩码
 *
 * Update Note：
 *      + v1.0.15 ：Created
 *
 * @class Sun.Util.Grid
 */
Sun.Util.Grid={
    /**
     * 获取网格指定数值范围的比例
     * @param model {LW.GridModel|LW.ContourModel} 数据模型
     * @param legendData
     * @returns {*}
     */
    getRatio : function (model,legendData) {
        // 重置图例比例
        legendData.forEach(function (item) {
            item.amount = 0;
        });
        var size = model.data ? model.data.data.length : model.grid.length;
        model.eachGrid(function (model,row,column,i) {
            var value = model.getGrid(row,column);
            if(model.isInvalid && model.isInvalid(value))
                return;
            var idx = Sun.Util.LegendData.getColorIndex(legendData,value);
            if(idx !== -1){
                var item = legendData[idx];
                item.amount++;
            }
        },model);
        legendData.forEach(function (item) {
            item.ratio = item.amount/size;
        });
        return legendData;
    },

    /**
     * 根据regionGrid获取网格对应区域的指定数值范围的比例
     * @param model {LW.GridModel|LW.ContourModel} 数据模型
     * @param legendData
     * @param regionGrid
     * @param id {int} -1--计算id>=-1的面积比，n--计算id=n的面积比
     */
    getRatioOfRegion : function(model,legendData,regionGrid,id){
        // 重置图例比例
        legendData.forEach(function (item) {
            item.amount = 0;
        });
        var size = 0;
        model.eachGrid(function (model,row,column,i) {
            var value = model.getGrid(row,column);
            var rid = regionGrid[i];
            if((id == -1 && rid > 0) || (id >= 0 && rid == id)){
                size++;
                if(model.isInvalid && model.isInvalid(value))
                    return;
                var idx = Sun.Util.LegendData.getColorIndex(legendData,value);
                if(idx !== -1){
                    var item = legendData[idx];
                    item.amount++;
                }
            }
        },model);
        legendData.forEach(function (item) {
            item.ratio = item.amount/size;
        });
        return legendData;
    },

    /**
     * 根据边界和网格，生成网格对应的区域掩码网格
     * @param model {LW.GridModel|LW.ContourModel} 数据模型
     * @param geojson {object} 行政边界geojson数据
     * @returns {Array}
     */
    getRegionGrid:function(model,geojson){
        var regionGrid = [];
        model.eachGrid(function (model,row,column,i) {
            var latlng = model.getCellLatLng(row,column);
            var id = -1;
            for(var j = 0; j<geojson.features.length;j++){
                var feature = geojson.features[j];
                for(var k = 0;k<feature.geometry.coordinates.length;k++){
                    var geo = feature.geometry;
                    var latlngs = geo.coordinates[k];
                    latlngs = geo.type === 'MultiPolygon' ? latlngs[0] : latlngs;
                    if(Sun.Util.Geometry.pointInPolygon(latlng.lng,latlng.lat,latlngs)){
                        id = feature.id || feature.properties.id;
                        break;
                    }
                }
                if(id!==-1)
                    break;
            }
            regionGrid[i] = id;
        },model);
        return regionGrid;
    },

    /**
     * 获取指定值对应的区域id
     * @param model {LW.GridModel} 数据模型
     * @param values {Array<int>} eg:[3,4] 获取网格值为3和4的区域id
     * @param regionGrid
     */
    getRegionIdOfValues:function(model,values,regionGrid){
        var regionData = {};
        values.forEach(function (v) {
            regionData[v] = [];
        });
        model.eachGrid(function (model,row,column,i) {
            var v = model.getGrid(row,column);
            if(values.indexOf(v)!==-1){
                var regionId = regionGrid[i];
                if(regionId !== -1){
                    if(regionData[v].indexOf(regionId)===-1)
                        regionData[v].push(regionId);
                }
            }
        },model);
        return regionData;
    }
};

/**
 * IOBuffer，Buffer操作
 *
 * Features :
 *      1. 对ArrayBuffer的读取和写入操作
 *
 * Update Note：
 *      + v1.0.7 ：Created
 *      + v1.0.13 : 修正ASCII码为10-15（a-f)解析中文出错的问题
 *
 * @class Sun.IOBuffer
 */
Sun.IOBuffer = Sun.Class.extend({

        defaultByteLength : 1024 * 8,
        charArray : [],

        initialize:function (data,options) {
            options = options || {};
            if (data === undefined) {
                data = this.defaultByteLength;
            }
            if (typeof data === 'number') {
                data = new ArrayBuffer(data);
            }
            var length = data.byteLength;
            var offset = options.offset ? options.offset>>>0 : 0;
            if (data.buffer) {
                length = data.byteLength - offset;
                if (data.byteLength !== data.buffer.byteLength) { // Node.js buffer from pool
                    data = data.buffer.slice(data.byteOffset + offset, data.byteOffset + data.byteLength);
                } else if (offset) {
                    data = data.buffer.slice(offset);
                } else {
                    data = data.buffer;
                }
            }
            this.buffer = data;
            this.length = length;
            this.byteLength = length;
            this.byteOffset = 0;
            this.offset = 0;
            this.littleEndian = true;
            this._data = new DataView(this.buffer);
            this._increment = length || this.defaultByteLength;
            this._mark = 0;
        },

        available:function (byteLength) {
            if (byteLength === undefined) byteLength = 1;
            return (this.offset + byteLength) <= this.length;
        },

        isLittleEndian:function () {
            return this.littleEndian;
        },

        setLittleEndian:function () {
            this.littleEndian = true;
        },

        isBigEndian:function () {
            return !this.littleEndian;
        },

        setBigEndian:function () {
            this.littleEndian = false;
        },

        skip:function (n) {
            if (n === undefined) n = 1;
            this.offset += n;
        },

        seek:function (offset) {
            this.offset = offset;
        },

        mark:function () {
            this._mark = this.offset;
        },

        reset:function () {
            this.offset = this._mark;
        },

        rewind:function () {
            this.offset = 0;
        },

        ensureAvailable:function (byteLength) {
            if (byteLength === undefined) byteLength = 1;
            if (!this.available(byteLength)) {
                var newIncrement;
                if(byteLength>this._increment*2)
                    newIncrement = byteLength;
                else{
                    newIncrement = this._increment + this._increment;
                    this._increment = newIncrement;
                }
                var newLength = this.length + newIncrement;
                var  newArray = new Uint8Array(newLength);
                newArray.set(new Uint8Array(this.buffer));
                this.buffer = newArray.buffer;
                this.length = newLength;
                this._data = new DataView(this.buffer);
            }
        },

        readBoolean:function () {
            return this.readUint8() !== 0;
        },

        readInt8:function () {
            return this._data.getInt8(this.offset++);
        },

        readUint8:function () {
            return this._data.getUint8(this.offset++);
        },

        readByte:function () {
            return this.readUint8();
        },

        readBytes:function (n) {
            if (n === undefined) n = 1;
            var bytes = new Uint8Array(n);
            for (var i = 0; i < n; i++) {
                bytes[i] = this.readByte();
            }
            return bytes;
        },

        readInt16:function () {
            var value = this._data.getInt16(this.offset, this.littleEndian);
            this.offset += 2;
            return value;
        },

        readUint16:function () {
            var value = this._data.getUint16(this.offset, this.littleEndian);
            this.offset += 2;
            return value;
        },

        readInt32:function () {
            var value = this._data.getInt32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        },

        readUint32:function () {
            var value = this._data.getUint32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        },

        readFloat32:function () {
            var value = this._data.getFloat32(this.offset, this.littleEndian);
            this.offset += 4;
            return value;
        },

        readFloat64:function () {
            var value = this._data.getFloat64(this.offset, this.littleEndian);
            this.offset += 8;
            return value;
        },

        readChar:function () {
            var unicode = this.readUint8();
            return String.fromCharCode(unicode);
        },

        readChars:function (n) {
            if (n === undefined) n = 1;
            this.charArray.length = n;
            for (var i = 0; i < n; i++) {
                // this.charArray[i] = this.readChar();
                this.charArray[i] = this.readUint8();
            }
            var chars = this.charArray.map(function (item) {
                var hex = item.toString(16);
                hex = hex.length == 1 ? (0+hex) : hex;
                return '%'+hex;
            }).join('');
            return decodeURIComponent(chars);
            // return this.charArray.join('');
        },

        writeBoolean:function (bool) {
            this.writeUint8(bool ? 0xff : 0x00);
        },

        writeInt8:function (value) {
            this.ensureAvailable(1);
            this._data.setInt8(this.offset++, value);
        },

        writeUint8:function (value) {
            this.ensureAvailable(1);
            this._data.setUint8(this.offset++, value);
        },

        writeByte:function (value) {
            this.writeUint8(value);
        },

        writeBytes:function (bytes) {
            this.ensureAvailable(bytes.length);
            for (var i = 0; i < bytes.length; i++) {
                this._data.setUint8(this.offset++, bytes[i]);
            }
        },

        writeInt16:function (value) {
            this.ensureAvailable(2);
            this._data.setInt16(this.offset, value, this.littleEndian);
            this.offset += 2;
        },

        writeUint16:function (value) {
            this.ensureAvailable(2);
            this._data.setUint16(this.offset, value, this.littleEndian);
            this.offset += 2;
        },

        writeInt32:function (value) {
            this.ensureAvailable(4);
            this._data.setInt32(this.offset, value, this.littleEndian);
            this.offset += 4;
        },

        writeUint32:function (value) {
            this.ensureAvailable(4);
            this._data.setUint32(this.offset, value, this.littleEndian);
            this.offset += 4;
        },

        writeFloat32:function (value) {
            this.ensureAvailable(4);
            this._data.setFloat32(this.offset, value, this.littleEndian);
            this.offset += 4;
        },

        writeFloat64:function (value) {
            this.ensureAvailable(8);
            this._data.setFloat64(this.offset, value, this.littleEndian);
            this.offset += 8;
        },

        writeChar:function (str) {
            this.writeUint8(str.charCodeAt(0));
        },

        writeChars:function (str) {
            var strArr = Sun.Util.Data.strToUnicode(str);
            for (var i = 0; i < strArr.length; i++) {
                this.writeUint8(strArr[i]);
            }
        },

        toArray:function () {
            return new Uint8Array(this.buffer, 0, this.length);
        }
    });


(function () {
    /**
     * Nc数据的读取/写入
     *
     * Features :
     *      1. 对版本3.0的nc数据的解析
     *      2. 可以设置Variable的值
     *      3. 可以读取Variable中的attribute的值
     *      4. 可以对buffer重新写入
     *
     * Update Note：
     *      + v1.0.11 ：1. Created(transfer from netcdf.js)
     *                  2. 增加buffer的重新写入
     *      + v1.0.13 ：增加数据精度属性，读取数据段部分，默认保留两位小数
     *
     *
     * @class Sun.NCReader
     */
    Sun.NCReader = Sun.Class.extend({
        options:{

        },

        initialize: function (data, options) {
            var buffer = new Sun.IOBuffer(data);
            buffer.setBigEndian();

            // Validate that it's a NetCDF file
            utils.notNetcdf((buffer.readChars(3) !== 'CDF'), 'should start with CDF');

            // Check the NetCDF format
            var version = buffer.readByte();
            utils.notNetcdf((version === 2), '64-bit offset format not supported yet');
            utils.notNetcdf((version !== 1), 'unknown version');

            // Read the header
            this.header = readHeader()(buffer);
            this.header.version = version;
            this.buffer = buffer;
        },


        getVersion: function () {
            if (this.header.version === 1) {
                return 'classic format';
            } else {
                return '64-bit offset format';
            }
        },


        getRecordDimension: function () {
            return this.header.recordDimension;
        },


        getDimensions: function () {
            return this.header.dimensions;
        },

        /**
         * 获取全局属性
         */
        getGlobalAttributes: function () {
            return this.header.globalAttributes;
        },

        getAttribute: function (name,attribute) {
            attribute = attribute || this.header.globalAttributes;
            var attr = Sun.Util.Array.getItemByField(attribute, 'name', name);
            return Sun.Util.Common.isValid(attr)?attr.value:attr;
        },

        setAttribute: function (name,value,attribute) {
            attribute = attribute || this.header.globalAttributes;
            var attr = Sun.Util.Array.getItemByField(attribute, 'name', name);
            if(Sun.Util.Common.isValid(attr))
                attr.value = value;
            else
                attribute.push({name:name,type:"char",value:value});
        },

        /**
         * 获取Variable
         */
        getVariables: function () {
            return this.header.variables;
        },

        /**
         * 获取Variable属性
         */
        getVariableAttribute: function (variableName, attrName) {
            var variable = typeof variableName === 'string' ?
                Sun.Util.Array.getItemByField(this.header.variables, 'name', variableName) : variableName;
            return this.getAttribute(attrName,variable.attributes);
        },

        /**
         * 设置Variable属性
         */
        setVariableAttribute: function (variableName, attrName, value) {
            var variable = typeof variableName === 'string' ?
                Sun.Util.Array.getItemByField(this.header.variables, 'name', variableName) : variableName;
            this.setAttribute(attrName,value,variable.attributes);
        },

        /**
         * 获取Variable数据
         */
        getDataVariable: function (variableName,precision) {
            var variable;
            if (typeof variableName === 'string') {
                // search the variable
                // Tip:因Array.prototype.find需要谷歌45版本以上，遂不用此方法
                variable = Sun.Util.Array.getItemByField(this.header.variables, 'name', variableName);
            } else {
                variable = variableName;
            }

            // throws if variable not found
            utils.notNetcdf((variable === undefined), 'variable not found');

            // go to the offset position
            this.buffer.seek(variable.offset);

            if (variable.record) {
                // record variable case
                return data.record(this.buffer, variable, this.header.recordDimension);
            } else {
                // non-record variable case
                return data.nonRecord(this.buffer, variable,precision);
            }
        },


        /**
         * [To be deprecated] 用getNewBuffer代替
         * @param variableName
         * @param value
         * @returns {*|void}
         */
        setDataVariable: function (variableName, value) {
            var variable;
            if (typeof variableName === 'string') {
                // search the variable
                // Tip:因Array.prototype.find需要谷歌45版本以上，遂不用此方法
                variable = Sun.Util.Array.getItemByField(this.header.variables, 'name', variableName);
            } else {
                variable = variableName;
            }

            // throws if variable not found
            utils.notNetcdf((variable === undefined), 'variable not found');

            // go to the offset position
            this.buffer.seek(variable.offset);

            // non-record variable case
            return data.writeNonRecord(this.buffer, variable, value);
        },

        toArray: function () {
            return this.buffer.toArray();
        },

        getNewBuffer:function (json,uv) {
            var header = this.header,self = this;
            var buffer = new Sun.IOBuffer(this.buffer.length);
            buffer.setBigEndian();

            buffer.writeChars('CDF');
            buffer.writeByte(1);// version

            writeDimension();
            writeAttributes(header.globalAttributes);// global attr
            writeVariables();
            writeData();

            return buffer.toArray();

            function writeDimension(){
                buffer.writeUint32(0);
                buffer.writeUint32(NC_DIMENSION);
                var dimensions = header.dimensions;
                buffer.writeUint32(dimensions.length);
                for(var i=0;i<dimensions.length;i++){
                    utils.writeName(buffer,dimensions[i].name);
                    buffer.writeUint32(dimensions[i].size);
                }
            }

            function writeAttributes(attributes) {
                buffer.writeUint32(NC_ATTRIBUTE);
                buffer.writeUint32(attributes.length);
                for(var i=0;i<attributes.length;i++){
                    utils.writeName(buffer,attributes[i].name);
                    var type = types.str2num(attributes[i].type);
                    buffer.writeUint32(type);
                    var value = attributes[i].value;
                    buffer.writeUint32(getLength(value,true,true));
                    types.writeType(buffer,type,value);
                    // Apply padding
                    utils.padding(buffer);
                }
            }

            function writeVariables() {
                buffer.writeUint32(NC_VARIABLE);
                var variables = header.variables;
                buffer.writeUint32(variables.length);
                var offset = buffer.offset+10;
                for(var i=0;i<variables.length;i++){
                    utils.writeName(buffer,variables[i].name);
                    var dims = variables[i].dimensions;
                    buffer.writeUint32(dims.length);
                    for(var j=0;j<dims.length;j++){
                        buffer.writeUint32(dims[j]);
                    }
                    writeAttributes(variables[i].attributes);
                    var type = types.str2num(variables[i].type);
                    buffer.writeUint32(type);
                    buffer.writeUint32(variables[i].size);//latsize*lonsize*4
                    offset += i==0 ? getVariablesSize() : variables[i-1].size;
                    variables[i]._offset = offset;
                    buffer.writeUint32(offset);
                }
            }

            function writeData() {
                var variables = header.variables;
                for(var i=0;i<variables.length;i++){
                    var variable= variables[i];
                    buffer.seek(variable._offset);
                    var value,name = variable.name;
                    if(name.indexOf('lat') != -1 || name.indexOf('lon') != -1)
                        value = self.getDataVariable(name);
                    else{
                        if(uv){
                            var type = name.indexOf('u') != -1 ? 'u' : 'v';
                            var idx = name.indexOf('u') != -1 ? 0 : 1;
                            name = name.replace(type,'uv');
                            value = json.data[name]?json.data[name].data[idx]:json.data[idx];
                        }
                        else
                            value = json.data[name]?json.data[name].data:json.data;
                    }
                    data.writeNonRecord(buffer, variable, value);
                }
            }

            function getVariablesSize() {
                var size = 0;
                var variables = header.variables;
                for(var i=0;i<variables.length;i++){
                    var variable = variables[i];
                    size += (4+getLength(variable.name));
                    size += (4+4*variable.dimensions.length);
                    size += 8;// 12 & attrLength
                    for(var j=0;j<variable.attributes.length;j++){
                        var attr = variable.attributes[j];
                        size += (4+getLength(attr.name));
                        size += 4;//type
                        size += (4+getLength(attr.value,true));//因为attribute都是字符串，所以可以直接用length当长度
                    }
                    size += 12;// type & size & offset
                }
                return size;
            }

            function getLength(str,zh,normal) {
                var _str = zh?Sun.Util.Data.strToUnicode(str):str;
                return normal?_str.length:Math.ceil(_str.length/4)*4;
            }
        }
    });

    var utils = {
        /**
         * Throws a non-valid NetCDF exception if the statement it's true
         * @ignore
         * @param {boolean} statement - Throws if true
         * @param {string} reason - Reason to throw
         */
        notNetcdf: function (statement, reason) {
            if (statement) {
                throw new TypeError('Not a valid NetCDF v3.x file: ' + reason);
            }
        },

        /**
         * Moves 1, 2, or 3 bytes to next 4-byte boundary
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         */
        padding: function (buffer) {
            if ((buffer.offset % 4) !== 0) {
                buffer.skip(4 - (buffer.offset % 4));
            }
        },


        /**
         * Reads the name
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @return {string} - Name
         */
        readName: function (buffer) {
            // Read name
            var nameLength = buffer.readUint32();
            var name = buffer.readChars(nameLength);

            // validate name
            // TODO

            // Apply padding
            this.padding(buffer);
            return name;
        },

        writeName: function (buffer,name) {
            var nameLength = name.length;
            buffer.writeUint32(nameLength);
            buffer.writeChars(name);
            // Apply padding
            this.padding(buffer);
        }
    };

    var types = {
        notNetcdf: utils.notNetcdf,

        types: {
            BYTE: 1,
            CHAR: 2,
            SHORT: 3,
            INT: 4,
            FLOAT: 5,
            DOUBLE: 6
        },

        /**
         * Parse a number into their respective type
         * @ignore
         * @param {number} type - integer that represents the type
         * @return {string} - parsed value of the type
         */
        num2str: function (type) {
            switch (Number(type)) {
                case this.types.BYTE:
                    return 'byte';
                case this.types.CHAR:
                    return 'char';
                case this.types.SHORT:
                    return 'short';
                case this.types.INT:
                    return 'int';
                case this.types.FLOAT:
                    return 'float';
                case this.types.DOUBLE:
                    return 'double';
                /* istanbul ignore next */
                default:
                    return 'undefined';
            }
        },

        /**
         * Parse a number type identifier to his size in bytes
         * @ignore
         * @param {number} type - integer that represents the type
         * @return {number} -size of the type
         */
        num2bytes: function (type) {
            switch (Number(type)) {
                case this.types.BYTE:
                    return 1;
                case this.types.CHAR:
                    return 1;
                case this.types.SHORT:
                    return 2;
                case this.types.INT:
                    return 4;
                case this.types.FLOAT:
                    return 4;
                case this.types.DOUBLE:
                    return 8;
                /* istanbul ignore next */
                default:
                    return -1;
            }
        },

        /**
         * Reverse search of num2str
         * @ignore
         * @param {string} type - string that represents the type
         * @return {number} - parsed value of the type
         */
        str2num: function (type) {
            switch (String(type)) {
                case 'byte':
                    return this.types.BYTE;
                case 'char':
                    return this.types.CHAR;
                case 'short':
                    return this.types.SHORT;
                case 'int':
                    return this.types.INT;
                case 'float':
                    return this.types.FLOAT;
                case 'double':
                    return this.types.DOUBLE;
                /* istanbul ignore next */
                default:
                    return -1;
            }
        },

        /**
         * Auxiliary function to read numeric data
         * @ignore
         * @param {number} size - Size of the element to read
         * @param {function} bufferReader - Function to read next value
         * @return {Array<number>|number}
         */
        readNumber: function (size, bufferReader) {
            if (size !== 1) {
                var numbers = new Array(size);
                for (var i = 0; i < size; i++) {
                    numbers[i] = bufferReader();
                }
                return numbers;
            } else {
                return bufferReader();
            }
        },

        /**
         * Given a type and a size reads the next element
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @param {number} type - Type of the data to read
         * @param {number} size - Size of the element to read
         * @return {string|Array<number>|number}
         */
        readType: function (buffer, type, size) {
            switch (type) {
                case this.types.BYTE:
                    return buffer.readBytes(size);
                case this.types.CHAR:
                    return this.trimNull(buffer.readChars(size));
                case this.types.SHORT:
                    return this.readNumber(size, buffer.readInt16.bind(buffer));
                case this.types.INT:
                    return this.readNumber(size, buffer.readInt32.bind(buffer));
                case this.types.FLOAT:
                    return this.readNumber(size, buffer.readFloat32.bind(buffer));
                case this.types.DOUBLE:
                    return this.readNumber(size, buffer.readFloat64.bind(buffer));
                /* istanbul ignore next */
                default:
                    this.notNetcdf(true, 'non valid type ' + type);
                    return undefined;
            }
        },

        writeType: function (buffer, type, value) {
            switch (type) {
                case this.types.BYTE:
                    return buffer.writeByte(value);
                case this.types.CHAR:
                    return buffer.writeChars(value);
                case this.types.SHORT:
                    return buffer.writeInt16(value);
                case this.types.INT:
                    return buffer.writeInt32(value);
                case this.types.FLOAT:
                    return buffer.writeFloat32(value);
                case this.types.DOUBLE:
                    return buffer.writeFloat64(value);
                /* istanbul ignore next */
                default:
                    this.notNetcdf(true, 'non valid type ' + type);
                    return undefined;
            }
        },

        /**
         * Removes null terminate value
         * @ignore
         * @param {string} value - String to trim
         * @return {string} - Trimmed string
         */
        trimNull: function (value) {
            if (value.charCodeAt(value.length - 1) === 0) {
                return value.substring(0, value.length - 1);
            }
            return value;
        }
    };

    var data = {
        /**
         * Read data for the given non-record variable
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @param {object} variable - Variable metadata
         * @return {Array} - Data of the element
         */
        nonRecord: function (buffer, variable,precision) {
            precision = precision || 1;
            // variable type
            var type = types.str2num(variable.type);

            // size of the data
            var size = variable.size / types.num2bytes(type);

            // iterates over the data
            var data = new Array(size);
            for (var i = 0; i < size; i++) {
                data[i] = Sun.Util.Math.toRoundFixed(types.readType(buffer, type, 1),precision);
            }

            return data;
        },

        writeNonRecord: function (buffer, variable, data) {
            // variable type
            var type = types.str2num(variable.type);

            // size of the data
            var size = variable.size / types.num2bytes(type);

            for (var i = 0; i < size; i++) {
                types.writeType(buffer, type, data[i]);
            }
        },

        /**
         * Read data for the given record variable
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @param {object} variable - Variable metadata
         * @param {object} recordDimension - Record dimension metadata
         * @return {Array} - Data of the element
         */
        record: function (buffer, variable, recordDimension) {
            // variable type
            var type = types.str2num(variable.type);

            // size of the data
            // TODO streaming data
            var size = recordDimension.length;

            // iterates over the data
            var data = new Array(size);
            var step = recordDimension.recordStep;

            for (var i = 0; i < size; i++) {
                var currentOffset = buffer.offset;
                data[i] = types.readType(buffer, type, 1);
                buffer.seek(currentOffset + step);
            }

            return data;
        }
    };

    var NC_DIMENSION = 10;
    var NC_VARIABLE = 11;
    var NC_ATTRIBUTE = 12;

    function readHeader() {
        // Grammar constants
        var ZERO = 0;

        /**
         * Read the header of the file
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @return {object} - Object with the fields:
         *  * `recordDimension`: Number with the length of record dimension
         *  * `dimensions`: List of dimensions
         *  * `globalAttributes`: List of global attributes
         *  * `variables`: List of variables
         */
        function header(buffer) {
            // Length of record dimension
            // sum of the varSize's of all the record variables.
            var header = {recordDimension: {length: buffer.readUint32()}};

            // List of dimensions
            var dimList = dimensionsList(buffer);
            header.recordDimension.id = dimList.recordId;
            header.recordDimension.name = dimList.recordName;
            header.dimensions = dimList.dimensions;

            // List of global attributes
            header.globalAttributes = attributesList(buffer);

            // List of variables
            var variables = variablesList(buffer, dimList.recordId);
            header.variables = variables.variables;
            header.recordDimension.recordStep = variables.recordStep;

            return header;
        }

        /**
         * List of dimensions
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @return {object} - List of dimensions and record dimension with:
         *  * `name`: String with the name of the dimension
         *  * `size`: Number with the size of the dimension
         */
        function dimensionsList(buffer) {
            var recordId, recordName;
            var dimList = buffer.readUint32();
            if (dimList === ZERO) {
                utils.notNetcdf((buffer.readUint32() !== ZERO), 'wrong empty tag for list of dimensions');
                return [];
            } else {
                utils.notNetcdf((dimList !== NC_DIMENSION), 'wrong tag for list of dimensions');

                // Length of dimensions
                var dimensionSize = buffer.readUint32();
                var dimensions = new Array(dimensionSize);
                for (var dim = 0; dim < dimensionSize; dim++) {
                    // Read name
                    var name = utils.readName(buffer);

                    // Read dimension size
                    var size = buffer.readUint32();
                    if (size === 0) {
                        recordId = dim;
                        recordName = name;
                    }

                    dimensions[dim] = {
                        name: name,
                        size: size
                    };
                }
            }
            return {
                dimensions: dimensions,
                recordId: recordId,
                recordName: recordName
            };
        }

        /**
         * List of attributes
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @return {Array<object>} - List of attributes with:
         *  * `name`: String with the name of the attribute
         *  * `type`: String with the type of the attribute
         *  * `value`: A number or string with the value of the attribute
         */
        function attributesList(buffer) {
            var gAttList = buffer.readUint32();
            if (gAttList === ZERO) {
                utils.notNetcdf((buffer.readUint32() !== ZERO), 'wrong empty tag for list of attributes');
                return [];
            } else {
                utils.notNetcdf((gAttList !== NC_ATTRIBUTE), 'wrong tag for list of attributes');

                // Length of attributes
                var attributeSize = buffer.readUint32();
                var attributes = new Array(attributeSize);
                for (var gAtt = 0; gAtt < attributeSize; gAtt++) {
                    // Read name
                    var name = utils.readName(buffer);

                    // Read type
                    var type = buffer.readUint32();
                    utils.notNetcdf(((type < 1) || (type > 6)), 'non valid type ' + type);

                    // Read attribute
                    var size = buffer.readUint32();
                    var value = types.readType(buffer, type, size);

                    // Apply padding
                    utils.padding(buffer);

                    attributes[gAtt] = {
                        name: name,
                        type: types.num2str(type),
                        value: value
                    };
                }
            }
            return attributes;
        }

        /**
         * List of variables
         * @ignore
         * @param {IOBuffer} buffer - Buffer for the file data
         * @param {number} recordId - Id if the record dimension
         * @return {object} - Number of recordStep and list of variables with:
         *  * `name`: String with the name of the variable
         *  * `dimensions`: Array with the dimension IDs of the variable
         *  * `attributes`: Array with the attributes of the variable
         *  * `type`: String with the type of the variable
         *  * `size`: Number with the size of the variable
         *  * `offset`: Number with the offset where of the variable begins
         *  * `record`: True if is a record variable, false otherwise
         */
        function variablesList(buffer, recordId) {
            var varList = buffer.readUint32();
            var recordStep = 0;
            if (varList === ZERO) {
                utils.notNetcdf((buffer.readUint32() !== ZERO), 'wrong empty tag for list of variables');
                return [];
            } else {
                utils.notNetcdf((varList !== NC_VARIABLE), 'wrong tag for list of variables');

                // Length of variables
                var variableSize = buffer.readUint32();
                var variables = new Array(variableSize);
                for (var v = 0; v < variableSize; v++) {
                    // Read name
                    var name = utils.readName(buffer);

                    // Read dimensionality of the variable
                    var dimensionality = buffer.readUint32();

                    // Index into the list of dimensions
                    var dimensionsIds = new Array(dimensionality);
                    for (var dim = 0; dim < dimensionality; dim++) {
                        dimensionsIds[dim] = buffer.readUint32();
                    }

                    // Read variables size
                    var attributes = attributesList(buffer);

                    // Read type
                    var type = buffer.readUint32();
                    type = type == 0 ? 5 : type;
                    utils.notNetcdf(((type < 1) && (type > 6)), 'non valid type ' + type);

                    // Read variable size
                    // The 32-bit varSize field is not large enough to contain the size of variables that require
                    // more than 2^32 - 4 bytes, so 2^32 - 1 is used in the varSize field for such variables.
                    // var varSize = buffer.readUint32();
                    var varSize = buffer.readInt32();

                    // Read offset
                    // TODO change it for supporting 64-bit
                    var offset = buffer.readUint32();

                    // Count amount of record variables
                    if (dimensionsIds[0] === recordId) {
                        recordStep += varSize;
                    }

                    variables[v] = {
                        name: name,
                        dimensions: dimensionsIds,
                        attributes: attributes,
                        type: types.num2str(type),
                        size: varSize,
                        offset: offset,
                        record: (dimensionsIds[0] === recordId)
                    };
                }
            }

            return {
                variables: variables,
                recordStep: recordStep
            };
        }

        return header;
    }
})();



/**
 * Diamond数据的读取/写入
 *
 * Features :
 *      1. 公司diamond文件的读取/写入
 *
 * Update Note：
 *      + v1.0.11 ：1. Created
 *
 *
 * @class Sun.DmReader
 */
Sun.DmReader = Sun.Class.extend({
    initialize: function (options) {

    },

    readData:function (source) {
        var buffer = new Sun.IOBuffer(source);
        buffer.setBigEndian();

        if(buffer.readChars(7) !== 'diamond')
            return;

        var data = this.data={};
        data.sunType = buffer.readChars(2);
        data.version = buffer.readByte();
        data.year = buffer.readInt32();
        data.month = buffer.readInt32();
        data.day = buffer.readInt32();
        data.hour = buffer.readInt32();
        data.minute = buffer.readInt32();
        data.second = buffer.readInt32();
        data.timeSession = buffer.readInt32();
        data.eleLen = buffer.readInt32();
        data.eleCode = buffer.readChars(data.eleLen);
        data.titleLen = buffer.readInt32();
        data.title = buffer.readChars(data.titleLen);

        readWeightPoint();
        readLines();

        return data;
        
        function readWeightPoint() {
            var wPoints = [];
            var pointNum = buffer.readInt32();
            for(var i=0;i<pointNum;i++){
                var value = buffer.readFloat32();
                var lng = buffer.readFloat32();
                var lat = buffer.readFloat32();
                wPoints.push({value:value,lng:lng,lat:lat});
            }
            data.weightPoints = wPoints;
        }
        function readLines() {
            var lines = [];
            var lineNum = buffer.readInt32();
            for(var i=0;i<lineNum;i++){
                var lineValue = buffer.readFloat32();
                var points = [];
                var pointNum = buffer.readInt32();
                for(var j=0;j<pointNum;j++){
                    var lng = buffer.readFloat32();
                    var lat = buffer.readFloat32();
                    points.push([lat,lng]);
                }
                lines.push({linevalue:lineValue,pointitems:points});
            }
            data.lineitems = lines;
        }
        function readStation() {

        }
    },
    
    writeData:function (data) {
        var buffer = new Sun.IOBuffer();
        buffer.setBigEndian();

        buffer.writeChars('diamond');
        buffer.writeChars(data.sunType);
        buffer.writeByte(data.version);
        buffer.writeInt32(data.year);
        buffer.writeInt32(data.month);
        buffer.writeInt32(data.day);
        buffer.writeInt32(data.hour);
        buffer.writeInt32(data.minute);
        buffer.writeInt32(data.second);
        buffer.writeInt32(data.timeSession);
        buffer.writeInt32(data.eleLen);
        buffer.writeChars(data.eleCode);
        buffer.writeInt32(data.titleLen);
        buffer.writeChars(data.title);

        writeWeightPoint();
        writeLines();

        return buffer.toArray();

        function writeWeightPoint() {
            var wPoints = data.weightPoints;
            var pointNum = wPoints.length;
            buffer.writeInt32(pointNum);
            for(var i=0;i<pointNum;i++){
                var item = wPoints[i];
                buffer.writeFloat32(item.value);
                buffer.writeFloat32(item.lng);
                buffer.writeFloat32(item.lat);
            }
        }
        function writeLines() {
            var lines = data.lineitems;
            var lineNum = lines.length;
            buffer.writeInt32(lineNum);
            for(var i=0;i<lineNum;i++){
                var item = lines[i];
                buffer.writeFloat32(item.linevalue);
                var points = item.pointitems;
                var pointNum = points.length;
                buffer.writeInt32(pointNum);
                for(var j=0;j<pointNum;j++){
                    var p = points[j];
                    buffer.writeFloat32(p[1]);
                    buffer.writeFloat32(p[0]);
                }
            }
        }
    }
});
Sun.LegendData = {
    // zdz
    rain: [{color: '#ffffff', max: 0.1, min: 0, equalMin: true, equalMax: false,desc:'0~0.1'},
        {color: '#effbef', max: 1, min: 0.1, equalMin: true, equalMax: false,desc:'0.1~1'},
        {color: '#9bf696', max: 10, min: 1, equalMin: true, equalMax: false,desc:'1~10'},
        {color: '#349c00', max: 20, min: 10, equalMin: true, equalMax: false},
        {color: '#1989c5', max: 50, min: 20, equalMin: true, equalMax: false},
        {color: '#0000ff', max: 100, min: 50, equalMin: true, equalMax: false},
        {color: '#fd00fd', max: 250, min: 100, equalMin: true, equalMax: false},
        {color: '#ff0000', max: NaN, min: 250, equalMin: true, equalMax: false}],

    wind: [{color: '#cedff7', max: 1.6, min: 0, equalMin: true, equalMax: false},
        {color: '#9cbeef', max: 3.4, min: 1.6, equalMin: true, equalMax: false},
        {color: '#6b9ee7', max: 5.5, min: 3.4, equalMin: true, equalMax: false},
        {color: '#397dde', max: 8, min: 5.5, equalMin: true, equalMax: false},
        {color: '#295dc6', max: 10.8, min: 8, equalMin: true, equalMax: false},
        {color: '#009221', max: 13.9, min: 10.8, equalMin: true, equalMax: false},
        {color: '#efcb08', max: 17.2, min: 13.9, equalMin: true, equalMax: false},
        {color: '#ff9a00', max: 20.8, min: 17.2, equalMin: true, equalMax: false},
        {color: '#ff7500', max: 24.5, min: 20.8, equalMin: true, equalMax: false},
        {color: '#ff5500', max: 28.5, min: 24.5, equalMin: true, equalMax: false},
        {color: '#ff2800', max: 32.7, min: 28.5, equalMin: true, equalMax: false},
        {color: '#bd1ca5', max: NaN, min: 32.7, equalMin: true, equalMax: false}],

    airtemp: [{color: '#0000ff', max: -16, min: -24, equalMin: true, equalMax: false},
        {color: '#0045ff', max: -12, min: -16, equalMin: true, equalMax: false},
        {color: '#0065ff', max: -8, min: -12, equalMin: true, equalMax: false},
        {color: '#0086ff', max: -6, min: -8, equalMin: true, equalMax: false},
        {color: '#00a6ff', max: -4, min: -6, equalMin: true, equalMax: false},
        {color: '#00c7ff', max: -2, min: -4, equalMin: true, equalMax: false},
        {color: '#00ebff', max: 0, min: -2, equalMin: true, equalMax: false},
        {color: '#00fff7', max: 2, min: 0, equalMin: true, equalMax: false},
        {color: '#00ffb5', max: 4, min: 2, equalMin: true, equalMax: false},
        {color: '#00ff73', max: 6, min: 4, equalMin: true, equalMax: false},
        {color: '#00ff29', max: 8, min: 6, equalMin: true, equalMax: false},
        {color: '#73ff00', max: 12, min: 8, equalMin: true, equalMax: false},
        {color: '#94ff00', max: 16, min: 12, equalMin: true, equalMax: false},
        {color: '#b5ff00', max: 20, min: 16, equalMin: true, equalMax: false},
        {color: '#d6ff00', max: 24, min: 20, equalMin: true, equalMax: false},
        {color: '#ffe700', max: 26, min: 24, equalMin: true, equalMax: false},
        {color: '#ffc700', max: 28, min: 26, equalMin: true, equalMax: false},
        {color: '#ffa200', max: 30, min: 28, equalMin: true, equalMax: false},
        {color: '#ff8200', max: 32, min: 30, equalMin: true, equalMax: false},
        {color: '#ff6100', max: 35, min: 32, equalMin: true, equalMax: false},
        {color: '#ff4100', max: 37, min: 35, equalMin: true, equalMax: false},
        {color: '#ff2800', max: 38, min: 37, equalMin: true, equalMax: false},
        {color: '#d60000', max: 40, min: 38, equalMin: true, equalMax: false},
        {color: '#8c0000', max: NaN, min: 40, equalMin: true, equalMax: false}],

    visible: [{color: '#732800', max: 0.1, min: 0, equalMin: true, equalMax: false},
        {color: '#9c00ff', max: 0.2, min: 0.1, equalMin: true, equalMax: false},
        {color: '#ff0408', max: 0.5, min: 0.2, equalMin: true, equalMax: false},
        {color: '#ff5900', max: 1, min: 0.5, equalMin: true, equalMax: false},
        {color: '#ffcf00', max: 2, min: 1, equalMin: true, equalMax: false},
        {color: '#efeb31', max: 3, min: 2, equalMin: true, equalMax: false},
        {color: '#c6fb31', max: 5, min: 3, equalMin: true, equalMax: false},
        {color: '#73fb39', max: 10, min: 5, equalMin: true, equalMax: false},
        {color: '#31fbad', max: 15, min: 10, equalMin: true, equalMax: false},
        {color: '#6bcbe7', max: 20, min: 15, equalMin: true, equalMax: false},
        {color: '#94dff7', max: 30, min: 20, equalMin: true, equalMax: false},
        {color: '#ffffff', max: NaN, min: 30, equalMin: true, equalMax: false}],

    rh: [{color: '#ff0000', max: 10, min: 0, equalMin: true, equalMax: false},
        {color: '#ff4d00', max: 15, min: 10, equalMin: true, equalMax: false},
        {color: '#ff7d00', max: 20, min: 15, equalMin: true, equalMax: false},
        {color: '#ff9a00', max: 25, min: 20, equalMin: true, equalMax: false},
        {color: '#ffae00', max: 30, min: 25, equalMin: true, equalMax: false},
        {color: '#ffcf00', max: 40, min: 30, equalMin: true, equalMax: false},
        {color: '#ceff00', max: 50, min: 40, equalMin: true, equalMax: false},
        {color: '#7bff00', max: 60, min: 50, equalMin: true, equalMax: false},
        {color: '#00ffb5', max: 70, min: 60, equalMin: true, equalMax: false},
        {color: '#00cfff', max: 80, min: 70, equalMin: true, equalMax: false},
        {color: '#00a2ff', max: 90, min: 80, equalMin: true, equalMax: false},
        {color: '#0071ff', max: 95, min: 90, equalMin: true, equalMax: false},
        {color: '#0049ff', max: 100, min: 95, equalMin: true, equalMax: true}],

    pressure: [{color: '#bd24ff', max: 908, min: 900, equalMin: true, equalMax: false},
        {color:'#9c24ff',max:908, min:904, equalMin:true, equalMax:false},
        {color: '#a53cff', max: 916, min: 908, equalMin: true, equalMax: false},
        {color:'#ad55ff',max:916, min:912, equalMin:true, equalMax:false},
        {color: '#b569ff', max: 924, min: 916, equalMin: true, equalMax: false},
        {color:'#ce86ff',max:924, min:920, equalMin:true, equalMax:false},
        {color: '#ce96ff', max: 932, min: 924, equalMin: true, equalMax: false},
        {color:'#e7baff',max:932, min:928, equalMin:true, equalMax:false},
        {color: '#5ab6ff', max: 940, min: 932, equalMin: true, equalMax: false},
        {color:'#7bc7ff',max:940, min:936, equalMin:true, equalMax:false},
        {color: '#9ccfff', max: 948, min: 940, equalMin: true, equalMax: false},
        {color:'#b5d7ff',max:948, min:944, equalMin:true, equalMax:false},
        {color: '#d6e7ff', max: 956, min: 948, equalMin: true, equalMax: false},
        {color:'#c6ffff',max:956, min:952, equalMin:true, equalMax:false},
        {color: '#9cfbff', max: 964, min: 956, equalMin: true, equalMax: false},
        {color:'#6bf7ff',max:964, min:960, equalMin:true, equalMax:false},
        {color: '#42f3ff', max: 972, min: 964, equalMin: true, equalMax: false},
        {color:'#21ffef',max:972, min:968, equalMin:true, equalMax:false},
        {color: '#21ffce', max: 980, min: 972, equalMin: true, equalMax: false},
        {color:'#21ff94',max:980, min:976, equalMin:true, equalMax:false},
        {color: '#21ff73', max: 988, min: 980, equalMin: true, equalMax: false},
        {color:'#29ff31',max:988, min:984, equalMin:true, equalMax:false},
        {color: '#5aff21', max: 996, min: 988, equalMin: true, equalMax: false},
        {color:'#a5ff21',max:996, min:992, equalMin:true, equalMax:false},
        {color: '#c6ff21', max: 1004, min: 996, equalMin: true, equalMax: false},
        {color:'#efff21',max:1004, min:1000, equalMin:true, equalMax:false},
        {color: '#ffef21', max: 1012, min: 1004, equalMin: true, equalMax: false},
        {color:'#ffcb21',max:1012, min:1008, equalMin:true, equalMax:false},
        {color: '#ffa621', max: 1020, min: 1012, equalMin: true, equalMax: false},
        {color:'#ff8621',max:1020, min:1016, equalMin:true, equalMax:false},
        {color: '#ff6d21', max: NaN, min: 1020, equalMin: true, equalMax: false}],

    // radar
    radar: [{color: '#0200f3', value: -5}, {color: '#0199ec', value: 0},
        {color: '#00ebeb', value: 5}, {color: '#00ff00', value: 10},
        {color: '#02c200', value: 15}, {color: '#018400', value: 20},
        {color: '#fffa00', value: 25}, {color: '#e8b800', value: 30},
        {color: '#ff8600', value: 35}, {color: '#fb0200', value: 40},
        {color: '#c70100', value: 45}, {color: '#980002', value: 50},
        {color: '#ff00fe', value: 55}, {color: '#a586ed', value: 60},
        {color: '#ffffff', value: 65}],

    radar2: [{color: '#1e26d0', value: -5}, {color: '#00aca4', value: 0},
        {color: '#c0c0fe', value: 5}, {color: '#7a72ee', value: 10},
        {color: '#a6fca8', value: 15}, {color: '#00ea00', value: 20},
        {color: '#10921a', value: 25}, {color: '#fcf464', value: 30},
        {color: '#c8c802', value: 35}, {color: '#8c8c00', value: 40},
        {color: '#feacac', value: 45}, {color: '#fe645c', value: 50},
        {color: '#ee0230', value: 55}, {color: '#d48efe', value: 60},
        {color: '#aa24fa', value: 65}],

    // 基本反射率/组合反射率 单位：dbz
    radar_fsl: [{color: '#00aea5', value: -5}, {color: '#c6c3ff', value: 0},
        {color: '#7b71ef', value: 5}, {color: '#1824d6', value: 10},
        {color: '#a5ffad', value: 15}, {color: '#00eb00', value: 20},
        {color: '#109218', value: 25}, {color: '#fff763', value: 30},
        {color: '#cecb00', value: 35}, {color: '#8c8e00', value: 40},
        {color: '#ffaead', value: 45}, {color: '#ff655a', value: 50},
        {color: '#ef0031', value: 55}, {color: '#d68eff', value: 60},
        {color: '#ad24ff', value: 65}],

    // 基本速度 单位：m/s
    radar_jbsd: [{color: '#7be3ff', value: -27}, {color: '#00e3ff', value: -20},
        {color: '#00b2b5', value: -15}, {color: '#00ff00', value: -10},
        {color: '#00c700', value: -5}, {color: '#008200', value: -1},
        {color: '#ffffff', value: 0}, {color: '#ff0000', value: 1},
        {color: '#ff595a', value: 5}, {color: '#ffb2b5', value: 10},
        {color: '#ff7d00', value: 15}, {color: '#ffd300', value: 20},
        {color: '#ffff00', value: 27}, {color: '#7b007b', value: 'RF'}],

    //回波顶高 单位：km
    radar_hdbg: [{color: '#737573', value: 2}, {color: '#00e3ff', value: 3},
        {color: '#00b2ff', value: 5}, {color: '#0092ce', value: 6},
        {color: '#310094', value: 8}, {color: '#00fb94', value: 9},
        {color: '#00ba00', value: 11}, {color: '#00ef00', value: 12},
        {color: '#ffbe00', value: 14}, {color: '#ffff00', value: 15},
        {color: '#ad0000', value: 17}, {color: '#ff0000', value: 18},
        {color: '#ffffff', value: 20}, {color: '#e700ff', value: 21}],

    // 液态降水量 单位：kg/m^2
    radar_ytjsl: [{color: '#9c9e9c', value: 1}, {color: '#737573', value: 5},
        {color: '#ffaaad', value: 10}, {color: '#ef8e8c', value: 15},
        {color: '#ce7173', value: 20}, {color: '#00fb94', value: 25},
        {color: '#00ba00', value: 30}, {color: '#ffff73', value: 35},
        {color: '#d6d363', value: 40}, {color: '#ff6163', value: 45},
        {color: '#de0000', value: 50}, {color: '#ad0000', value: 55},
        {color: '#0000ff', value: 60}, {color: '#ffffff', value: 65},
        {color: '#e700ff', value: 70}],

    // 累积降水 单位：mm
    radar_ljjs: [{color: '#adaaad', value: 0}, {color: '#737573', value: 2},
        {color: '#00ffff', value: 6}, {color: '#00aead', value: 12},
        {color: '#00ff00', value: 19}, {color: '#008e00', value: 25},
        {color: '#ff00ff', value: 31}, {color: '#ad307b', value: 38},
        {color: '#0000ff', value: 44}, {color: '#310094', value: 50},
        {color: '#ffff00', value: 63}, {color: '#ffaa00', value: 76},
        {color: '#ff0000', value: 101}, {color: '#ad0000', value: 152},
        {color: '#ffffff', value: 203}],

    // 风暴总降水 单位：mm
    radar_fbzjs: [{color: '#00aea5', value: 0}, {color: '#c6c3ff', value: 7},
        {color: '#1824d6', value: 15}, {color: '#a5ffad', value: 25},
        {color: '#00eb00', value: 38}, {color: '#109218', value: 50},
        {color: '#fff763', value: 63}, {color: '#cecb00', value: 76},
        {color: '#8c8e00', value: 101}, {color: '#ffaead', value: 127},
        {color: '#ff655a', value: 152}, {color: '#ef0031', value: 203},
        {color: '#d68eff', value: 254}, {color: '#ad24ff', value: 304},
        {color: '#ffffff', value: 381}],

    //风暴相对径向速度 单位：mm
    radar_fbxdjxsd: [{color: '#00aea5', value: -10}, {color: '#c6c3ff', value: -5},
        {color: '#7b71ef', value: 0}, {color: '#1824d6', value: 5},
        {color: '#a5ffad', value: 10}, {color: '#00eb00', value: 15},
        {color: '#109218', value: 20}, {color: '#fff763', value: 25},
        {color: '#cecb00', value: 30}, {color: '#8c8e00', value: 35},
        {color: '#ffaead', value: 40}, {color: '#ff655a', value: 45},
        {color: '#ff655a', value: 50}, {color: '#d68eff', value: 55},
        {color: '#ad24ff', value: 60}, {color: '#ffffff', value: 65}],

    typ:{
        current:[{color:'#9a5bbc',value:"超强台风"},
            {color:'#e8605b',value:"强台风"},
            {color:'#ef9f50',value:"台风"},
            {color:'#f9de5e',value:"强热带风暴"},
            {color:'#6bb654',value:"热带风暴"},
            {color:'#4c9ff8',value:"热带低压"}],
        forecast:[{color:'#ff0000',value:"北京"},
            {color:'#f0ff00',value:"广州"},
            {color:'#d76000',value:"上海"},
            {color:'#49ff01',value:"香港"},
            {color:'#197aff',value:"福州"},
            {color:'#f600ff',value:"杭州"},
            {color:'#0d913e',value:"台湾"},
            {color:'#054098',value:"关岛"},
            {color:'#888888',value:"韩国"},
            {color:'#8a00a8',value:"日本"}]
    }

};

