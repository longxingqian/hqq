let config = {
    resource: {
        // cityLine: "resources/shanxi_prov_line.json",
        cityName: "resources/chengdu_county_name.json",
        countyLine:"resources/chengdu_county_line.json"
    },
    map: {
        mapOpts: {
            maxZoom: 18,
            minZoom: 3,
            wheelPxPerZoomLevel: 300,
            zoomDelta: 0.5,
            zoomSnap: 0.5,
            doubleClickZoom: false,
            zoomControl: false,
            editable: true,
            attributionControl: false
        },
        mapUrl: {
            "blue":{
                name:"蓝灰图",
                data:[
                    {
                        // url: "http://www.cdsqxt.com.cn:10003/Files/MapFile/TIANDITU/DIXING/Mercator/{z}/{x}/{y}.png"
                        url: "http://59.175.195.205:10003/Files/MapFile/HW/quanguo&blue_gray&name/Mercator/{xyz}.jpg"
                    }
                ]
            },
            "xz":{
                name:"行政图",
                data:[
                    {
                        url: "http://www.cdsqxt.com.cn:10003/Files/MapFile/TIANDITU/XINGZHENG/Mercator/{z}/{x}/{y}.png"
                    }
                ]
            },
            "dx": {
                name:"地形图",
                data: [
                    {
                        url: "http://www.cdsqxt.com.cn:10003/Files/MapFile/TIANDITU/WEIXING/Mercator/{z}/{x}/{y}.png"
                    }
                ]
            }
        }
    }
};