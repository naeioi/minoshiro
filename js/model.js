/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, jquery){
    function Model(){
        this.Container_constructor();
    }

    var p = create.extend(Model, createjs.Container);

    //put template into container
    p.put = function(){
        var self = this;

        //put bg
        for(var i = 0; i < self.bg.length; i++){
            var bg = self.bg[i];
            var bitmap = new createjs.Bitmap(bg.img);
            bitmap.set({
                x: bg.x,
                y: bg.y,
                scaleX: bg.scaleX,
                scaleY: bg.scaleY
            })
            self.addChild(bitmap);
        }

        //put elements
        for(var i = 0; i < self.elements.length; i++){
            var element = self.elements[i];
            var bitmap = new createjs.Bitmap(element.img);
            bitmap.set({
                x: element.x,
                y: element.y,
                scaleX: element.scaleX,
                scaleY: element.scaleY
            })
            self.addChild(bitmap);
        }

        //put texts;
        for(var i = 0; i < self.texts.length; i++){
            var imgtext = self.texts[i];
            self.addChild(imgtext);
        }
    }

    //read main.json and load template
    p.load = function(src)
    {
        var self = this;
        var t = new createjs.Template();
        this.template = t;

        var def = $.get(src);

        //load template
        def = def.then(function(res){
            return t.load(res);
        })

        //add all staff into container
        def = def.then(function(){
            this.put();
        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})