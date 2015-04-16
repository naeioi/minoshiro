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
        //console.log(model);
        stage.update();
    })

    createjs.Ticker.addEventListener("tick", stage);

    stage.enableMouseOver(10);
})
