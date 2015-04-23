/**
 * Created by naeioi on 2015/4/18.
 */
requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-2.1.3.min',
        'jqueryui':'../lib/jquery-ui'
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});

require(['Controller','jqueryui'], function() {


    controller = new Controller('canvas');
    jmpStep(1);
    var curTarget = null;
    var curStr = null;
    var curX = null;
    var curY = null;
    var curSize = null;

    $(controller).click(function(e){
        curTarget = e.target;
        curStr = e.originText;
        curX = e.x;
        curY = e.y;
        curSize = e.fontSize;
    })

    $('#h-slider').slider({
        max:300,
        min:0,
        animate:"fast",
        change:function(event,ui){
            curTarget.change({
                fontSize:ui.value
            });
            $('#sizeshow').text(ui.value);
        }
    });
    //检查textarea更改并更新
    //不要通过绑定textarea.onchange实现这个功能，有bug
    setInterval(function(){
        var str = $('#textarea').val();
        if(curTarget != null && (str != curStr || x != curX || y != curY || size != curSize)){
            curStr = str;
            curX = x;
            curY = y;
            curSize = size;
            curTarget.change({
                originText: str,
                x: x,
                y: y,
                fontSize: size
            });
        }
    }, 0.2)

    $(controller).click(function(e){
        curTarget = e.target;
        curStr = e.originText;
        $('#textarea').val(curStr);
    })



    $('#btnspecific').click(function(){
        controller.output().then(function(data){
            console.log(data);
        })
    })

    $('#fileSelect').change(function(e){
        controller.set_bg(e.target.files[0]);
    })
});