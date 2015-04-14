/**
 * Created by naeioi on 2015/4/14.
 */
requirejs(["createjs"], function(createjs){
    function Template(){
        this.DisplayObject_Constructor();
    }

    var p = createjs.extend(Template, createjs.DisplayObject);
    createjs.Template = Template;
    return createjs.prompt(Template, "DisplayObject");
})