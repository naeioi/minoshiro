/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, jquery){
    function Model(){
        this.Container_constructor();
    }

    var p = create.extend(Model, createjs.Container);



    Model.load = function(src)
    {
        mode = "demo";
        var self = this;
        var t = new createjs.Template();
        this.template = t;

        var def = $.get(src);

        def = def.then(function(res){

            return t.load(res);


        })


        //add all staff into container
        def = def.then(function(){

        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})