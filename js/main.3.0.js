/**
 * Created by naeioi on 2015/4/18.
 */
requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-2.1.3.min'
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});

require(['Controller'], function() {
    controller = new Controller('canvas');
    jmpStep(1);
    var curTarger = null;
    var curStr = null;

    $(controller).click(function(e){
        curTarger = e.targer;
        curStr = e.text;
        $('#textarea').val(curStr);
    })


    //检查textarea更改并更新
    //不要通过绑定textarea.onchange实现这个功能，有bug
    setInterval(function(){
        var str = $('#textarea').val();
        if(curTarger != null && str != curStr){
            curStr = str;
            curTarger.change(str);
        }
    }, 0.2)

    //调用controller.output输出origin大小的base64
    //注意output()需要从服务器异步加载数据，因此返回的是jQuery的promise对象
    $('#btnspecific').click(function(){
        controller.output().then(function(data){
            console.log(data);
        })
    })

    $('#fileSelect').change(function(e){
        controller.set_bg(e.target.files[0]);
    })
});