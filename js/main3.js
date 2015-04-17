/**
 * Created by naeioi on 2015/4/3.
 */
/*
This is the main JS file for requireJS
 */

requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-1.11.1.min'
    },
    shim: {
        /*'jquery': {
            export: '$'
        },*/
        /*'createjs': {
            export: 'createjs'
        }*/
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});

require(['createjs', 'jquery', 'controller', 'ImageText', 'TextLine', 'Model'], function(createjs, $, controller){

    createjs.ImageText.config({
        imageLoader: controller.imageLoader
    })

    var stage = new createjs.Stage('canvas');
    var model = new createjs.Model();
    //var bitmap = new createjs.Bitmap("templates/class1/item1/demo/bg.png");
    var img = document.createElement("img");
    img.src = "templates/class1/item1/demo/bg.png";
    var bitmap = new createjs.Bitmap(img);

    //stage.addChild(bitmap);
    //model.addChild(bitmap);
    stage.addChild(model);

    var def = model.load("templates/class1/item1/main.json");
    def.done(function(){
        //  console.log(model);
        stage.update();
    })

    createjs.Ticker.addEventListener("tick", stage);

    stage.enableMouseOver(10);

    $('#btn').click(function(){
        model.output().then(function(img){
            location.href = img;
        })
    })

    var curTarget = null;
    var curStr = null;
    model.addEventListener('click', function(e){
        if(e.target.name === 'TextLine'){
            console.log('click');
            var imgtext = e.target.father;
            $('#textarea').val(imgtext.originText);
            curTarget = imgtext;
            curStr = imgtext;
        }
    })
    /*$('#textarea').on('keydown', function(){
        if(curTarget){
            var text = $('#textarea').val();
            console.log('onchange');
            console.log(text);
            curTarget.load(text);
        }
    })*/

    setInterval(function(){
        var str = $('#textarea').val();
        if(str != curStr){
            str = str || " ";
            curStr = str;
            curTarget.load(curStr);
        }
    }, 0.2);
    //createjs.Ticker.addEventListener('tick', stage);

    //model.dispatchEvent('click');
})