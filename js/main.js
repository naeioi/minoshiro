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
        'jquery': {
            export: '$'
        },
        /*'createjs': {
            export: 'createjs'
        }*/
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});
/*
require(['createjs', 'jquery', 'controller', 'ImageText', 'TextLine'], function(){

    createjs.ImageText.config({
        imageLoader: controller.imageLoader
    })

    var stage = new createjs.Stage('canvas');
    var imagetext = new createjs.ImageText("hello", 0, 0, 0, 20, 'arial', '000000');

    stage.addChild(imagetext);

    stage.update();

    stage.enableMouseOver(10);
})*/
require(['createjs'], function(createjs){
    console.log(createjs);
})
