/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, jquery){
    function Model(){
        this.Container_constructor();
    }

    var p = create.extend(Model, createjs.Container);

    Model.load = function(src, mode)
    {
        mode = mode || "demo";
        var self = this;
        var t = new createjs.Template();

        var def = $.get(src);

        def = def.then(function(res){

            var baseUrl = mode+'/';

            if(mode === 'demo'){

                //scale to proper size in demo mode
                var scaleX = res.demo_width  / res.origin_width,
                    scaleY = res.demo_height / res.origin_height;

                t.set({
                    width: res.demo_width,
                    height: res.demo_height
                })

                //load and set bg img
                //note that the src of default bg is src[0], with others choices to be manually selected
                var def = getImage(baseUrl + res.bg.src[0]);
                def = def.then(function(img){
                    //img is <img> object, due to the inconvenience of base64
                    t.bg[0].img = img;
                    t.bg[0].x = t.bg[0].y = 0;
                    t.bg[0].scaleX = t.width / img.width;
                    t.bg[0].scaleY = t.height / img.height;
                })

                //load and set elements
                def = def.then(function(){

                    //load the elements one by one(instead of in parallel)
                    var chain = $.Deferred();
                    chain.resolve();

                    for(var i = 0; i < t.elements.length; i++){
                        var e = res.elements[i];

                        chain = chain.then(function(){
                            return getImage(baseUrl + e.src).then(function(img){

                                var obj = e;
                                e.img = img;
                                e.scaleX = scaleX;
                                e.scaleY = scaleY;
                                e.x = e.x * scaleX;
                                e.y = e.y * scaleY;

                                t.elements.push(obj);
                            });
                        })
                    }

                    return chain.promise();
                })

                //load texts
                def = def.then(function(){

                    var texts = res.texts;

                    var chain = $.Deferred();
                    chain.resolve();

                    for(var i = 0; i < texts.length; i++){
                        var text = texts[i];
                        var imgtext = new createjs.ImageText(text.context, text.reg, text.dir,
                                                             text.space, Math.floor(text.size * scaleX),
                                                             text.font, text.color);

                        imgtext.x = imgtext.x / scaleX;
                        imgtext.y = imgtext.y / scaleY;

                        chain = chain.then(imgtext.load);
                    }

                    chain.done(def.resolve);
                })
            }
            else if(mode === 'origin'){

            }
        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})