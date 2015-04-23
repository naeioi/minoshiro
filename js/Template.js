/**
 * Created by naeioi on 2015/4/14.
 */
define(["createjs"], function(createjs){
    function Template(){
        this.DisplayObject_constructor();
        this.elements = [];
        this.bg = [];
        this.texts = [];
        this.manual_bg = null;
    }

    var p = createjs.extend(Template, createjs.DisplayObject);

    function getImage(src) {
        var def = $.Deferred();
        var img = document.createElement('img');
        img.src = src;
        img.onload = function(){
            def.resolve(img);
        };
        return def.promise();
    }

    p.load = function(rootUrl, res, mode) {

        //console.log("in template load");

        var t = this;

        mode = mode || "demo";

        //a map: color_name -> index
        if(!res.set_name && res.bg){
            res.set_name = [];
            for(var i = 0; i < res.bg.length; i++)
                res.set_name[i] = i;
        }

        res.set_name = res.set_name || [];

        if (!t.map) {
            t.map = {};
            for (var i = 0; i < res.set_name.length; i++)
                t.map[res.set_name[i]] = i;
        }

        var curColor = res.curColor || res.set_name[0];
        res.curColor = res.set_name[curColor];
        var cIndex = t.map[curColor];
        var self = this;

        t.res = res;
        t.rootUrl = rootUrl;

        var baseUrl = rootUrl;
        t.bg_manualable = res.bg_manualable;

        var width, height;

        if (mode === 'demo') {
            baseUrl = baseUrl + 'demo/';
            width = res.demo_width;
            height = res.demo_height;
        }
        else if (mode === 'origin') {
            baseUrl = baseUrl + 'origin/';
            width = res.origin_width;
            height = res.origin_height;
        }

        //scale to proper size in demo mode
        var scaleX = width / res.origin_width,
            scaleY = height / res.origin_height;

        t.set({
            width: width,
            height: height
        })

        var def = $.Deferred();
        def.resolve();

        //load and set bg img
        //note that the src of default bg is src[0], with others choices to be manually selected
        if(res.bg && res.bg[cIndex]) {
            def = getImage(baseUrl + res.bg[cIndex].src);
            def = def.then(function (img) {
                //img is <img> object, due to the inconvenience of base64
                var obj = {
                    img: img,
                    x: (res.bg[cIndex].x || 0) * scaleX,
                    y: (res.bg[cIndex].y || 0) * scaleY,
                    scaleX: 1,
                    scaleY: 1
                }

                t.bg = obj;
            })
        }

        //load and set elements
        def = def.then(function () {

            //load the elements one by one(instead of in parallel)
            var chain = $.Deferred();
            chain.resolve();

            for (var i = 0; i < t.elements.length; i++) {
                (function () {
                    var e = res.elements[i];

                    chain = chain.then(function () {
                        return getImage(baseUrl + e.src).then(function (img) {

                            var obj = e;
                            e.img = img;
                            e.scaleX = scaleX;
                            e.scaleY = scaleY;
                            e.x = e.x * scaleX;
                            e.y = e.y * scaleY;

                            t.elements.push(obj);
                        });
                    })
                })();
            }

            return chain.promise();
        })

        //load texts
        def = def.then(function () {
            var texts = res.texts;
            res.text_color = res.text_color || [];
            var colors = res.text_color[cIndex] || [];

            var chain = $.Deferred();
            chain.resolve();

            for (var i = 0; i < texts.length; i++) {
                (function () {
                    var text = texts[i];
                    var color = colors[i];
                    var imgtext = new createjs.ImageText(text.content, text.reg, text.dir,
                        text.space, Math.floor(text.size * scaleX),
                        text.font, color);

                    imgtext.x = text.x * scaleX;
                    imgtext.y = text.y * scaleY;

                    t.texts.push(imgtext);

                    chain = chain.then(function () {
                        return imgtext.load();
                    });
                })();
            }

            return chain.promise();
        })

        //load manual_bg
        if(res.manual_bg){
            def = def.then(function(){
                var img = document.createElement('img');
                img.src = res.manual_bg.src;

                var def2 = $.Deferred();
                img.onload = function () {
                    //console.log(img);
                    self.manual_bg = {
                        img: img,
                        x: res.manual_bg.x * scaleX,
                        y: res.manual_bg.y * scaleY,
                        scaleX: scaleX,
                        scaleY: scaleY
                    }
                    def2.resolve();
                }
                return def2.promise();
            });
        }

        return def.promise();
    }

    p.set_color = function(colorset){
        var t = this;
        var res = t.res;
        var scaleX = res.demo_width / res.origin_width,
            scaleY = res.demo_height / res.origin_height;

        t.curColor = colorset;
        res.curColor = colorset;
        var cIndex = t.map[colorset];
        var baseUrl = t.rootUrl + 'demo/';

        var def = getImage(baseUrl + res.bg[cIndex].src);
        def = def.then(function (img) {
            //img is <img> object, due to the inconvenience of base64
            var obj = {
                img: img,
                x: (res.bg[cIndex].x || 0) * scaleX,
                y: (res.bg[cIndex].y || 0) * scaleY,
                scaleX: 1,
                scaleY: 1
            }

            t.bg = obj;
        })

        def = def.then(function () {
            var texts = t.res.texts;
            //t.res.text_color = t.res.text_color || [];
            var colors = t.res.text_color[cIndex] || [];

            var chain = $.Deferred();
            chain.resolve();

            for (var i = 0; i < texts.length; i++) {
                chain = chain.then(function () {
                    return t.texts[i].change(texts[i].content, colors[i]);
                })
            }

            return chain.promise();
        })

        return def.promise();
    }

    p.set_bg = function(url){
        var self = this;
        var res = this.res;

        var def = $.Deferred();
        var img = document.createElement('img');
        var scaleX = res.demo_width / res.origin_width, scaleY = res.demo_height / res.origin_height;

        img.src = url;
        img.onload = function(){

            res.manual_bg = {
                src: url,
                x: res.origin_width / 4,
                y: res.origin_height / 4,
                scaleX: res.origin_width / 2 / img.width,
                scaleY: res.origin_width / 2 / img.width
            }

            self.manual_bg = {
                img: img,
                x: res.manual_bg.x * scaleX, y: res.manual_bg.y * scaleY,
                scaleX: scaleX,
                scaleY: scaleY
            }

            def.resolve();
        }

        return def.promise();
    }

    /*p.loadOrigin = function(){
        return this.load(this.rootUrl, this.res, 'origin');
    }*/

    createjs.Template = Template;
    return createjs.promote(Template, "DisplayObject");
})