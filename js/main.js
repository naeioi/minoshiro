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

require(['createjs', 'jquery', 'controller', 'ImageText', 'TextLine'], function(createjs, $, controller){

    //console.log(createjs.ImageText);

    createjs.ImageText.config({
        imageLoader: controller.imageLoader
    })

    var stage = new createjs.Stage('canvas');//100pt->120px base height
    var imagetext = new createjs.ImageText("中文字体测试\n\n这是一行普通的文字\na string of texts\n另一行普通的文字");
    imagetext.set({
        fontSize: 30,
        fontFamily: "msjh.ttc",
        reg:0,
        dir:1,
        x: 100,
        y: 100
    })
    var shape = new createjs.Shape();

    console.log("in main.js, " + encodeURI("胡"));

    shape.graphics.beginFill('red').drawCircle(0, 0, 40);
    shape.x = shape.y = 0;

    //stage.addChild(shape);
    stage.addChild(imagetext);

    imagetext.load(null, function(){
        stage.update();
    });

    stage.enableMouseOver(10);
})

/*
require(['test'], function(test){
    test.test_jquery();
})*/
