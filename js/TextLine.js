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

        this.load(text);
    }

    var p = createjs.extend(TextLine, createjs.Bitmap);

    p.load = function(text)
    {
        this.text = text;
        this.image = p.imageLoader(this);
    }

    return createjs.promote(TextLine, "Bitmap");
});