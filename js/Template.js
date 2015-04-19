/**
 * Created by naeioi on 2015/4/14.
 */
define(["createjs"], function(createjs){
    function Template(){
        this.DisplayObject_constructor();
        this.elements = [];
        this.bg = [];
        this.texts = [];
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
        var t = this;

        mode = mode || "demo";

        t.res = res;
        t.rootUrl = rootUrl;

        var baseUrl = rootUrl;
        t.bg_manualable = res.bg_manualable;

        var width, height;

        if(mode === 'demo') {
            baseUrl = baseUrl + 'demo/';
            width = res.demo_width;
            height = res.demo_height;
        }
        else if(mode === 'origin'){
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
        if (res.bg && res.bg.length > 0) {
            def = getImage(baseUrl + res.bg[0].src);
            def = def.then(function (img) {
                //img is <img> object, due to the inconvenience of base64
                var obj = {
                    img: img,
                    x: (res.bg[0].x || 0) * scaleX,
                    y: (res.bg[0].y || 0) * scaleY,
                    scaleX: (res.bg[0].scaleX || 0) * scaleX,
                    scaleY: (res.bg[0].scaleY || 0) * scaleY
                }

                t.bg.push(obj);
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

            var chain = $.Deferred();
            chain.resolve();

            for (var i = 0; i < texts.length; i++) {
                (function () {
                    var text = texts[i];
                    var imgtext = new createjs.ImageText(text.content, text.reg, text.dir,
                        text.space, Math.floor(text.size * scaleX),
                        text.font, text.color);

                    imgtext.x = text.x * scaleX;
                    imgtext.y = text.y * scaleY;

                    t.texts.push(imgtext);

                    chain = chain.then(function(){
                        return imgtext.load();
                    });
                })();
            }

            return chain.promise();
        })

        return def.promise();
    }

    /*p.loadOrigin = function(){
        return this.load(this.rootUrl, this.res, 'origin');
    }*/

    createjs.Template = Template;
    return createjs.promote(Template, "DisplayObject");
})