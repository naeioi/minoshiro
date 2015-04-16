/**
 * Created by naeioi on 2015/4/14.
 */
requirejs(["createjs"], function(createjs){
    function Template(){
        this.DisplayObject_Constructor();
        this.elements = [];
        this.bg = [];
        this.texts = [];
    }

    var p = createjs.extend(Template, createjs.DisplayObject);

    function getImage(src) {
        var def = $.Deferred();
        var img = document.createElement('img');
        img.src = src;
        img.onload(function(){
            def.resolve(img);
        });
        return def.promise();
    }

    p.load = function(res) {
        var t = this;

        t.res = res;

        var baseUrl = 'mode/';
        t.bg_manualable = res.bg_manualable;

        //scale to proper size in demo mode
        var scaleX = res.demo_width / res.origin_width,
            scaleY = res.demo_height / res.origin_height;

        t.set({
            width: res.demo_width,
            height: res.demo_height
        })

        var def = $.Deferred();
        def.resolve();

        //load and set bg img
        //note that the src of default bg is src[0], with others choices to be manually selected
        if (res.bg && res.bg.length > 0) {
            def = getImage(baseUrl + res.bg[0].src);
            def = def.then(function (img) {
                //img is <img> object, due to the inconvenience of base64
                t.bg[0].img = img;
                t.bg[0].x = (res.bg[0].x || 0) * scaleX;
                t.bg[0].y = (res.bg[0].y || 0) * scaleY;
                t.bg[0].scaleX = (res.bg[0].scaleX || 0) * scaleX;
                t.bg[0].scaleY = (res.bg[0].scaleY || 0) * scaleY;
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
                    var imgtext = new createjs.ImageText(text.context, text.reg, text.dir,
                        text.space, Math.floor(text.size * scaleX),
                        text.font, text.color);

                    imgtext.x = imgtext.x / scaleX;
                    imgtext.y = imgtext.y / scaleY;

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

    createjs.Template = Template;
    return createjs.prompt(Template, "DisplayObject");
})