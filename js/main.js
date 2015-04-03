/**
 * Created by naeioi on 2015/4/3.
 */
/*
This is the main JS file for requireJS
 */

require.config({
    path: {
        'createjs': '../lib/easeljs-0.8.0.combined.js',
        'jquery': '../lib/jquery-1.11.1.min.js'
    },
    shim: {
        'jquery': {
            export: '$'
        }
    }
});

require(['createjs', 'jquery', 'controller', 'ImageText', 'TextLine'], function(){

    createjs.ImageText.config({
        imageLoader: controller.imageLoader
    })

    var stage = new createjs.Stage('canvas');
    var imagetext = new createjs.ImageText("hello", 0, 0, 0, 20, 'arial', '000000');

    stage.addChild(imagetext);

    stage.update();

    stage.enableMouseOver(10);
})