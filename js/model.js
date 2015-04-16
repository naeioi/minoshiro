/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, jquery){
    function Model(){
        this.Container_constructor();
    }

    var p = createjs.extend(Model, createjs.Container);

    //put template into container
    p.put = function(){
        var self = this;
        var t = self.template;

        //put bg
        for(var i = 0; i < t.bg.length; i++){
            var bg = t.bg[i];
            var bitmap = new createjs.Bitmap(bg.img);
            bitmap.set({
                x: bg.x,
                y: bg.y,
                scaleX: bg.scaleX || 1,
                scaleY: bg.scaleY || 1
            })
            self.addChild(bitmap);
        }

        //put elements
        for(var i = 0; i < t.elements.length; i++){
            var element = t.elements[i];
            var bitmap = new createjs.Bitmap(element.img);
            bitmap.set({
                x: element.x,
                y: element.y,
                scaleX: element.scaleX || 1,
                scaleY: element.scaleY || 1
            })
            self.addChild(bitmap);
        }

        //put texts;
        for(var i = 0; i < t.texts.length; i++){
            var imgtext = t.texts[i];
            self.addChild(imgtext);
        }
    }

    //read main.json and load template
    p.load = function(src)
    {
        var self = this;
        var t = new createjs.Template();
        var rootUrl = src.match(/^\S+\//);
        this.template = t;

        var def = $.get(src);

        //load template
        def = def.then(function(res){
            return t.load(rootUrl, res);
        })

        //add all staff into container
        def = def.then(function(){
            self.put();
        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})