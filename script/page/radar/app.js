(function (app) {
    var global={},map;
    function init() {
        let resources = {};
        $.ajaxSettings.async = false;
        for(let key in config.resource){
            $.getJSON(config.resource[key],function (data) {
                resources[key] = data;
            });
        }
        $.ajaxSettings.async = true;
        map              = L.map("map", config.map.mapOpts);
        app.map          = map;
        global.resources = resources;
        app.global       = global;
        app.layer.init();
    }
    init();
})(window);