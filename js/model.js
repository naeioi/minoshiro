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

        var dfd = $.get(src).then(function(res){

            var baseUrl = mode+'/';

            if(mode === 'demo'){

                var scaleX = res.demo_width  / res.origin_width,
                    scaleY = res.demo_height / res.origin_height;

                t.set({
                    width: res.demo_width,
                    height: res.demo_height
                })

                //load and set bg img
                var d = getImage(baseUrl + res.bg.src[0]).then(function(img){
                    t.bg[0].img = img;
                    t.bg[0].x = t.bg[0].y = 0;
                    t.bg[0].scaleX = t.width / img.width;
                    t.bg[0].scaleY = t.height / img.height;

                    var td = $.Deferred();  //ugly jQuery deferred
                    td.resolve();
                    return td.promise();
                })

                //load and set elements
                d = d.then(function(){
                    var d2 = $.Deferred();

                    for(var i = 0; i < t.elements.length; i++){
                        var e = res.elements[i];

                        d2 = d2.then(function(){
                            return getImage(baseUrl + e.src).then(function(img){

                                var obj = e;
                                e.img = img;

                                t.elements.push(obj);

                                var td = $.Deferred();  //ugly jQuery deferred
                                td.resolve();
                                return td.promise();
                            });
                        })
                    }

                    d2.resolve();
                })

                d = d.then(function(){

                    var texts = res.texts;

                    var d2=
                    for(var i = 0; i < texts.length; i++){
                        var text = texts[i];
                        var imgtext = new createjs.ImageText(text.context, text.reg, text.dir, text.space, text.size, text.font, text.color);

                    }

                    var td = $.Deferred();  //ugly jQuery deferred
                    td.resolve();
                    return td.promise();
                })
            }
            else if(mode === 'origin'){

            }
        })

        defer.resolve();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})