(function (window) {
    function init() {
        app.proxy.init();
        app.panel.init();
    }
    window.app = {init: init};
})(window);
