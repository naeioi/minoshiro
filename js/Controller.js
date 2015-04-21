/**
 * Created by naeioi on 2015/4/3.
 */
/*
This is the main JS file for requireJS
 */

define(['createjs', 'jquery', 'ImageText', 'TextLine', 'Model'], function(createjs, $){

    var Controller = function(canvas){
        this.stage = new createjs.Stage(canvas);
        this.model = null;
        createjs.Ticker.addEventListener('tick', this.stage);
        this.stage.enableMouseOver(10);
        this.stage.mouseMoveOutside = true;
        createjs.Touch.enable(this.stage);
    };

    var p = Controller.prototype;

    p.load = function(src){
        var self = this;
        this.stage.removeAllChildren();

        var model = new createjs.Model();
        //model.shadow = new createjs.Shadow('#000000', 5, 5, 10);
        this.model = model;
        var def = model.load(src);

        def = def.then(function(){
            var bound = model.getBounds();
            if(bound.width > self.stage.canvas.width){
                model.scaleY = model.scaleX = self.stage.canvas.width / bound.width;
                model.x = model.y = 0;
            }
            else{
                model.x = (self.stage.canvas.width - bound.width) / 2;
            }
        })

        def = def.then(function(){
            self.stage.addChild(model);
        })

        def = def.then(function(){
            model.addEventListener('click', function(e){
                if(e.target.name === "TextLine"){
                    $(self).trigger({
                        type: 'click',
                        targer: e.target.father,
                        text: e.target.father.originText
                    })
                }
            })
        })

        return def.promise();
    }

    p.output = function(){
        return this.model.output();
    }

    p.set_color = function(color){
        this.model.set_color(color);
    }

    //file is an instance of File(HTML5 API)
    p.set_bg = function(file){
        if(!/^image\//.test(file.type))
            throw "file is not an image";

        window.URL = window.URL || window.webkitURL;
        var url = window.URL.createObjectURL(file);

        this.model.set_bg(url);
    }

    window.Controller = Controller;
})