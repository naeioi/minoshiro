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
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener('tick', this.stage);
        this.stage.enableMouseOver(10);
        this.stage.mouseMoveOutside = true;
        createjs.Touch.enable(this.stage);
    };

    var p = Controller.prototype;

    p.load = function(src, mode){
        var self = this;
        this.stage.removeAllChildren();

        var model = new createjs.Model();
        //model.shadow = new createjs.Shadow('#000000', 5, 5, 10);
        this.model = model;
        mode = mode || 'demo';
        var def = model.load(src, mode);

        def = def.then(function(){

            var bound = {
                width: model.template.res[mode+'_width'],
                height: model.template.res[mode+'_height']
            }

            if(bound.width > self.stage.canvas.width){
                model.scaleY = model.scaleX = self.stage.canvas.width / bound.width;
                model.x = 0;
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
                    var obj = {
                        type: 'click',
                        target: e.target.father
                    }

                    for(var i in obj.target)
                        if(obj.target.hasOwnProperty(i))
                            obj[i] = obj.target[i];

                    $(self).trigger(obj);
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