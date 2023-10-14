/*屏幕自适应*/
function remReSize() {
    var w = $(window).width();
    try {
        w = $(parent.window).width();
    } catch (ex) {
    }
    ;
    if (w > 750) {
        w = 750;
    }
    ;
    $('html').css('font-size', 100 / 750 * w + 'px');
};remReSize();
$(window).resize(remReSize);
$(document).ready(function () {
    remReSize();
});
for (var i = 0; i < 3; i++) {
    setTimeout(remReSize, 100 * i);
}
;