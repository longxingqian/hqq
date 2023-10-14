(function (app) {
    let t = new Date(), time = new Date();
    t.addDays(-15);
    let vuePage = new Vue({
        el: "#vuePage",
        data: {
            chartShow: false,
            eleShow: false,
            layerShow: false,
            dataShow: false,
            show: false,
            timeShow: false,
            anyTimeShow: false,
            currentTime: time.Format("hh:mm"),
            minDate: t,
            maxDate: time,
            maxHour: time.getHours(),
            maxMinute: time.getMinutes(),
            date: "",
            cityShow: false,
            cityList: ["全省","郑州市","开封市","洛阳市","平顶山市","安阳市","鹤壁市","新乡市","焦作市","濮阳市","许昌市","漯河市","三门峡市","南阳市","商丘市","信阳市","周口市","驻马店市","济源市"],
            zdzName: false,
            zdzValue: true,
            fill: true,
            county: true,
            area: true,
            lod: true,
            grid: true
        },
        methods: {
            onConfirm(data) {
                this.timeShow = true;
                this.date = data;

                let sM = data.getMonth(),
                    sD = data.getDate(),
                    nM = time.getMonth(),
                    nD = time.getDate();

                if(sM === nM && sD === nD) {
                    this.maxHour = time.getHours();
                    this.maxMinute = time.getMinutes();
                }else{
                    this.maxHour = 23;
                    this.maxMinute = 59;
                }
            },
            selectTime(data) {
                this.timeShow = false;
                this.show = false;
                this.currentTime = data;
                app.panel.timeSelectDone(this.date.Format("yyyy/MM/dd ") + this.currentTime + ":00");
            },
            cancelTime() {
                this.timeShow = false;
            },
            onCityConfirm(val) {
                app.panel.changeCityName(val);
                app.layer.changeCityLine(val);
                this.cityShow = false;
            },
            onCityCancel() {
                this.cityShow = false;
            },
            checkboxChange(name) {
                console.log(name, this[name]);
                if(name === "zdzName") {
                    app.layer.setname(this[name])
                }else if(name === "zdzValue") {
                    app.layer.setZdzLayerOption("value",this[name])
                }else if(name === "fill") {
                    app.layer.setContourFill(this[name])
                }
            }
        }
    });
    app.vuePage = vuePage;
})(window);
