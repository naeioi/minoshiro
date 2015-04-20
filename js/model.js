/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, jquery){
    function Model(){
        this.Container_constructor();
    }

    var p = createjs.extend(Model, createjs.Container);

    //put template into container
    //bind res to texts at the same time
    p.put = function() {
        var self = this;
        var t = self.template;

        //put bg
        var bg = t.bg;
        var bitmap = new createjs.Bitmap(bg.img);
        bitmap.set({
            x: bg.x,
            y: bg.y,
            scaleX: bg.scaleX || 1,
            scaleY: bg.scaleY || 1
        })
        self.addChild(bitmap);

        //put elements
        for (var i = 0; i < t.elements.length; i++) {
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
        for (var i = 0; i < t.texts.length; i++) {
            var imgtext = t.texts[i];
            imgtext.res_text = t.res.texts[i];
            self.addChild(imgtext);
            //imgtext.dispatchEvent('click');
        }
    }

    //read main.json and load template
    p.load = function(src)
    {
        var self = this;
        var t = new createjs.Template();
        var rootUrl = src.match(/^\S+\//);

        this.template = t;
        this.rootUrl = rootUrl;

        var def = $.get(src);
        //console.log("begin load template");
        //console.log(src);

        //load template
        def = def.then(function(res){
            console.log("load done");
            return t.load(rootUrl, res);
        })

        //add all staff into container
        def = def.then(function(){
            self.put();
        })

        return def.promise();
    }

    p.set_color = function(colorset){
        var def = this.template.set_color(colorset);
        var self = this;
        def = def.then(function(){
            //console.log(this.template);
            self.put();
        })
        return def.promise();
    }

    p.output = function(){
        var oriModel = new createjs.Model();
        var oriTemplate = new createjs.Template();
        var def;

        oriModel.template = oriTemplate;
        def = oriTemplate.load(this.rootUrl, this.template.res, 'origin');
        def = def.then(function(){
            oriModel.put();
            oriModel.cache(0, 0, oriTemplate.width, oriTemplate.height);
            return oriModel.cacheCanvas.toDataURL('image/png');
        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})