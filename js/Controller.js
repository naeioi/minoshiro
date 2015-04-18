/**
 * Created by naeioi on 2015/4/3.
 */
/*
This is the main JS file for requireJS
 */

requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-2.1.3.min'
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

require(['createjs', 'jquery', 'ImageText', 'TextLine', 'Model'], function(createjs, $){

    var stage = new createjs.Stage('canvas');
    var model = new createjs.Model();

    stage.enableMouseOver(10);
    stage.addChild(model);
    createjs.Ticker.addEventListener("tick", stage);

    var def = model.load("templates/flat/baijiang/main.json");

    $('#btn').click(function(){
        model.output().then(function(img){
            location.href = img;
        })
    })

    var curTarget = null;
    var curStr = null;

    model.addEventListener('click', function(e){
        if(e.target.name === 'TextLine'){
            var imgtext = e.target.father;
            $('#textarea').val(imgtext.originText);
            curTarget = imgtext;
            curStr = imgtext;
        }
    })

    setInterval(function(){
        var str = $('#textarea').val();
        if(curTarget)
            curTarget.change(str);
    }, 0.2);
})