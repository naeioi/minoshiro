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

    var stage = new createjs.Stage('canvas');
    var imagetext = new createjs.ImageText("hello", 0, 0, 0, 120, 'arial', '000000');
    var shape = new createjs.Shape();

    shape.graphics.beginFill('red').drawCircle(0, 0, 40);
    shape.x = shape.y = 0;

    imagetext.x = imagetext.y = 0;

    //stage.addChild(shape);
    stage.addChild(imagetext);

    stage.update();

    stage.enableMouseOver(10);
})

/*
require(['test'], function(test){
    test.test_jquery();
})*/
