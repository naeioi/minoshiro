/**
 * Created by naeioi on 2015/4/3.
 */
/*
 TextLine
 TextLine由Bitmap继承而来
 TextLine保存一行文字的信息

 Property
 Text    @type string
 文字。
 image   @type Bitmap
 图片格式的文字
 dir     @type integer
 文字方向。0横1竖
 letterSpacing   @type integer
 文字间距。
 fontSize    @type integer
 文字大小。
 fontFamily  @type String
 字体。
 color   @type string
 颜色。
 */
define(['createjs'], function(createjs) {

    /*console.log('messsage frome TextLine: ');
    console.log(createjs);*/

    function TextLine(text, dir, space, size, family, color) {
        this.Bitmap_constructor();

        this.text = text || "";
        this.dir = dir || 0;
        this.image = null;
        this.letterSpacing = space || 0;
        this.fontSize = size || 12;
        this.fontFamily = family || "";     //需要选择默认字体
        this.color = color || '#000000';

        this.cursor = "text";
    }

    var p = createjs.extend(TextLine, createjs.Bitmap);

    TextLine.config = function(obj)
    {
        TextLine.imageLoader = obj.imageLoader;
    }

    p.load = function(text, callback)
    {
        text = text || this.text;

        var self = this;
        this.text = text;
        TextLine.imageLoader(this, function(data){
            self.image = data;

            //set HitArea so that a click on white space between letter will be captured
            var shape = new createjs.Shape();
            shape.graphics.beginFill("#000000").drawRect(0, 0, data.width, data.height);
            self.hitArea = shape;

            callback(self);
        });
    }

    createjs.TextLine = TextLine;
    return createjs.promote(TextLine, "Bitmap");
});