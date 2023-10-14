let config = {
    resource: {
        cityLine:"resources/chengdu_city_line.json",
        countyLine:"resources/chengdu_county_line.json",
        countyName:"resources/chengdu_county_name.json",
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
            attributionControl: false,
            dragging:false
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
    },
    ele: [{
        name: "降水",
        legend: "rain",
        unit: "mm",
        imgname:"rain",
        children: [
        {
            name: "未来1小时降水",
            hour: "01",
            val:"rain"
        },{
            name: "未来3小时降水",
            hour: "03",
            val:"rain3"
        },{
            name: "未来6小时降水",
            hour: "06",
            val:"rain6"
        },{
            name: "未来12小时降水",
            hour: "12",
            val:"rain12"
        },{
            name: "未来24小时降水",
            hour: "24",
            val:"rain24"
        }]
    },{
        name: "气温",
        legend: "airtemp",
        unit: "℃",
        imgname:"temp",
        children: [
        {
            name: "未来24小时最高温",
            hour: "24",
            val:"tmax24"
        },{
            name: "未来24小时最低温",
            hour: "24",
            val:"tmin24"
        },]
    },{
        name: "风",
        legend: "wind",
        unit: "m/s",
        imgname:"wind",
        children: [
        {
            name: "未来1小时极大风",
            hour: "01",
            val:"10uv"
        },{
            name: "未来12小时极大风",
            hour: "12",
            val:"10uv12"
        },{
            name: "未来24小时极大风",
            hour: "24",
            val:"10uv24"
        },]
    }],
};