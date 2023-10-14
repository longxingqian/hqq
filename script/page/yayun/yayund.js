$(function(){
    SW.Rpc.BaseProxy.include({
        ZDZ_GetDataByStationCodesAndWeatherKeys: function (code,etime,successFn,errorFn) {
            var params = [];
            params     = params.concat("onehour",code,"airtemp_current,wind_current,rh_current",etime);
            return this.invoke('ZDZ.GetDataByStationCodesAndWeatherKeys', params, 1, successFn, errorFn);
        },				
    });
    let zdzProxy = new SW.Rpc.BaseProxy({
        rootURL:'http://www.cdsqxt.com.cn:10003',
        serviceUrl: "/Weather/ZDZ",
        debug: true,
    });
    function init(){
        event();
        $.getJSON("resources/chengdu_changguan.json",function (data) {
            console.log(data);
            getchangguanl(data);
        });
    }
    function getchangguanl(totalarr){
        var chtml  ="";
        var stcode =[]; 
        for(var c=0;c<totalarr.length;c++){
            var citem = totalarr[c];
            chtml+=`<li datacode=${citem.code} dataid=${citem.id} datalon=${citem.x} datalat=${citem.y} datatype=${citem.type}>
                        <div class="litop">
                            <span>${citem.name}</span>
                            <img class="liright" src="images/yayund/zhankai.png" alt="">
                        </div>
                        <div class="libottom">
                            <div class="TEMP">
                                <img src="images/yayund/rwendu.png" alt="">
                                <div>
                                    <span>-°C</span>
                                    <p>温度</p>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="WIND">
                                <img src="images/yayund/winddird.png" alt="">
                                <div>
                                    <span>-m/s</span>
                                    <p>风速</p>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="RH">
                                <img src="images/yayund/rshidu.png" alt="">
                                <div>
                                    <span>-%</span>
                                    <p>相对湿度</p>
                                </div>
                            </div>
                        </div>
                    </li>`;
            stcode.push(citem.code);
        }
        $(".yayuncontent").html(chtml);
        let set  = new Set();
        stcode.forEach((item)=>{
            set.add(item);
        })
        let a    = Array.from(set);
        console.log(a);
        getlive(a.join(","));
    }
    function getlive(stcode){
        var ptoime = new Date();
        ptoime.addMinute(-10);
        zdzProxy.ZDZ_GetDataByStationCodesAndWeatherKeys(stcode,ptoime,function(res){
            console.log(res);
            for(var i=0;i<res.length;i++){
                var item  = res[i];
                var liarr = $(".yayuncontent li");
                $.each(liarr,function (index,value) {
                    if (item&&$(value).attr("datacode") == item.STATIONCODE) {
                        $(value).removeClass("grey");
                        if(item.AIRTEMP_CURRENT_VALUE){
                            $(value).find(".TEMP span").text((yTool.fomatFloat(item.AIRTEMP_CURRENT_VALUE,1)||"-")+"°C");
                        }
                        if(item.WIND_CURRENT_SPEEDVALUE){
                            $(value).find(".WIND span").text((yTool.fomatFloat(item.WIND_CURRENT_SPEEDVALUE,1)||"-")+"m/s");
                            $(value).find(".WIND img").attr("src",`images/yayund/winddird.png`);
                        }
                        if(item.RH_CURRENT_VALUE){
                            $(value).find(".RH span").text((item.RH_CURRENT_VALUE||"-")+"%");
                        }
                        if(!item.AIRTEMP_CURRENT_VALUE&&!item.WIND_CURRENT_SPEEDVALUE&&!item.RH_CURRENT_VALUE){
                            // $(value).addClass("grey");
                        }
                    }
                })
            }
        })
    }
    function event(){
        $(".yayunlist").on("click","li",function(){
            $(this).addClass("select").siblings().removeClass("select");
            var dname= $(this).attr("dataname");
            if(dname=="全部"){
                $(".yayuncontent").find("li").show();
            }else{
                var liarr = $(".yayuncontent li");
                $.each(liarr,function (index,value) {
                    if ($(value).attr("datatype") == dname) {
                        $(value).show();
                    }else{
                        $(value).hide();
                    }
                })
                // var s=  'li[datatype="'+dname+'"]'
                // $(".yayuncontent").find('li[datatype~="重点"]').show().siblings().hide();
            }
        })
        $(".yayuncontent").on("click","li",function(){
        //    if($(this).hasClass("grey")){
        //       return;
        //    }
           location.href = "venuespublic.html?"+"lon="+$(this).attr("datalon")+"&lat="+$(this).attr("datalat")+"&id="+$(this).attr("dataid");
        })
    }
    init();
})