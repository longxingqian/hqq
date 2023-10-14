(function (app) {
    SW.Rpc.BaseProxy.include({
        SAT_GetDataListByTypeCode: function (code,successFn,errorFn) {
            var params = [];
            params     = params.concat(code,20,-1,-1);
            return this.invoke('SAT.GetDataListByTypeCode', params, 1, successFn, errorFn);
        },
        Image_GetDataListByTypeCode: function (code,successFn,errorFn) {
            var params = [];
            params     = params.concat(code,"",6,-1,-1);
            return this.invoke('Image.GetDataListByTypeCode', params, 1, successFn, errorFn);
        }
    });
    let radProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/SAT",
        debug: true,
    });
    let radProxy1 = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/SWP",
        debug: true,
    });
    // 默认配置
    function init() {
        //http://www.cdsqxt.com.cn:10003/Weather/SAT?projectname=&calltype=&jsoncallback=&iquery=SAT.GetDataListByTypeCodeNew%7C2%7CString;TRUE_COLOR%7CInt32;20%7CInt32;-1%7CInt32;-1
        //http://www.cdsqxt.com.cn:10003/Weather/SAT?projectname=&calltype=&jsoncallback=&iquery=SAT.GetDataListByTypeCode%7C1%7CString;TRUE_COLOR%7CInt32;20%7CInt32;-1%7CInt32;-1
    }
    // 请求卫星云图数据
    function getSatelliteDataWithCode(SatelliteCode) {
        radProxy.SAT_GetDataListByTypeCode(SatelliteCode,function(res){
            console.log(res);
            res.sort(function(item1, item2) {
                return new Date(item1.PRODUCTTIME.replace(/-/g, '/')) - new Date(item2.PRODUCTTIME.replace(/-/g, '/'));
            });
            requestData(res);
        })
    }
    //请求雷达数据
    function getSatelliteDataWithCode1(code){
        radProxy1.Image_GetDataListByTypeCode(code,function(res){
            res.sort(function(item1, item2) {
                item1.PRODUCTTIME = item1.PREDICTIONTIME;
                item1.FILEPATH    = item1.IMAGEFILEPATH;
                item2.PRODUCTTIME = item2.PREDICTIONTIME;
                item2.FILEPATH    = item2.IMAGEFILEPATH;
                return new Date(item1.PREDICTIONTIME.replace(/-/g, '/')) - new Date(item2.PREDICTIONTIME.replace(/-/g, '/'));
            });
            console.log(res);
            requestData(res);
        })
    }
    // 处理数据
    function requestData(data){
        app.panel.setSatelliteData(data);
    }
    // 添加属性
    app.proxy={init: init,
        getSatelliteDataWithCode: getSatelliteDataWithCode,
        getSatelliteDataWithCode1:getSatelliteDataWithCode1};
})(window.app);