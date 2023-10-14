(function (app) {
    let tileLayer = {},baseLayers;
    let style     = {weight: 1,color: '#666',stroke: true,opacity: 1,fillColor: '#fff',fillOpacity: 1};
    function init() {
        setTiles();
        switchLayer("blue","blue");
        let baseSize = parseInt($("html")[0].style.fontSize);
        baseLayers   = {
            // cityLine: L.geoJson(global.resources.cityLine,{
            //     style: style,
            //     pane: 'boundaryPane', 
            //     interactive: false
            // }),
            cityName: new LW.LabelLayer({nameField:"name",locationField:"location",iconOptions:{
                iconSize: new L.Point(baseSize*2,baseSize*0.24),
                color: '#333',
                fontSize: '10px',
                bold: false,
                borderColor:'#fff'
            }}).setData(global.resources.cityName),
            countyLine: L.geoJson(global.resources.countyLine,{
                style: style,
                pane: 'boundaryPane', 
                interactive: true,
                // onEachFeature: (feature, layer) => {//方法1
                //     layer.on({
                //         click: () => {
                //             console.log("我",feature);
                //         }
                //     });
                // }
            }),
        };
        // baseLayers.cityLine.addTo(map);
        baseLayers.cityName.addTo(map);
        baseLayers.countyLine.addTo(map);
        map.fitBounds(baseLayers.countyLine.getBounds());
        //方法2
        baseLayers.countyLine.on('click', function (e) {
            var name      = e.layer.feature.properties.name;
            setTimeout(function () {//延时 
                removeeachLayer();
                app.panel.getlinedata(name);
            },100);
        })
    }
    //地图
    function setTiles(){
        var ops = config.map.mapUrl;
        for (var key in ops) {
            tileLayer[key] = L.layerGroup();
            var data = ops[key].data || [],
                len  = data.length;
            for (var i = 0; i < len; i++) {
                L.tileLayer(data[i].url, data[i].options || {}).addTo(tileLayer[key]);
            }
        }
    }
    //选择地图
    function switchLayer(oldTile, newTile) {
        map.removeLayer(tileLayer[oldTile]);
        map.addLayer(tileLayer[newTile]);
    }
    //选中地区
    function switchdata(data){
        removeeachLayer();
        //在填入筛选的颜色
        for(var i=0;i<data.length;i++){
            var item = data[i];
            for(var m=0;m<item.length;m++){
                var fdata = item[m];
                if(fdata.STATIONNAME){//站点存在
                    filldata(fdata);
                }
            }
        }
    }
    function removeeachLayer(){
        //先移除原来的填色
        baseLayers.countyLine.eachLayer(function (m) {
            var style       = m.options.style;
            style.fillColor = "#fff";
            m.setStyle(style);
        });
    }
    //填色
    function filldata(data){
        baseLayers.countyLine.eachLayer(function (m) {
            if(m.feature.properties.name.indexOf(data.COUNTY)>-1){
                var style       = m.options.style;
                style.fillColor = data.SIGNALLEVEL?getcolor(data):"#fff";
                m.setStyle(style);
            }
        });
    }
    //颜色
    function getcolor(data){
        switch (data.SIGNALLEVEL) {
            case "蓝色":
                return "#3183ff";
            case "黄色":
                return "#ffc731";
            case "橙色":
                return "#ff7600";
            case "红色":
                return "#ff0000";
        }
    }
    app.layer = {
        init: init,
        switchdata:switchdata
    }
})(window);