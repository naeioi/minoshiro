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
    //将controller声明为全局变量，方便ui.js等其他js文件取用
    //Controller(canvas)中canvas可以是HTML元素也可以是它的id
    controller = new Controller('canvas');

    //通过load方法从main.json文件中读取模板并放到canvas中
    //load返回jQuery的promise对象，方便异步操作
    controller.load('templates/flat/baijiang/main.json');

    /*
    --- 测试实时输入 ---

    当文字被点击时controller的click事件会被触发。
    事件对象e= {
        target: imagetext，
        text: "some text"
    }

    其中target是ImageText对象的实例。可以通过调用imagetext.change(str)更改文字
    text是事件触发时ImageText对象内的文字（注意：text并未跟imagetext绑定！调用imagetext.change(str)后text不会改变！
    */

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
    $('#btn').click(function(){
        controller.output().then(function(data){
            location.href = data;
        })
    })
})