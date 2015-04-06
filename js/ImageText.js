/**
 * Created by naeioi on 2015/4/3.
 */
/*
 ImageText
 ImageText由Container继承而来。
 ImageText以png形式保存文字。可能包含多行。

 Property
 originText  @type String
 原始字符串。以'\n'表示换行
 reg     @type integer
 参考点。0左上1右上2右下3坐下
 texts   @type array of TextLine
 文字数组。每个元素为一行字母
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

 Method
 load(string)
 载入string表示的字符串

 Event
 click
 当text被单击时触发。事件原型同control_bar中click_handler
*/

define(['createjs', 'TextLine'], function(createjs) {
    function ImageText(originText, reg, dir, space, size, family, color)
    {
        this.Container_constructor();

        this.originText = originText || "";
        this.reg = reg || 0;
        this.dir = dir || 0;
        this.letterSpacing = space || 0;
        this.fontSize = size || 20;
        this.fontFamily = family || "";
        this.color = color || "000000";
        this.lineHeight = 170;  //___% of font-size

        this.texts = [];
        this.name = "ImageText";    //click事件冒泡到model时用于判断是否是点击了文字
    }

    var p = createjs.extend(ImageText, createjs.Container);

    p.imageLoder = new Function();

    ImageText.config = function(obj)
    {
        createjs.TextLine.config(obj);
    };

    p.load = function(str, callback)
    {
        str = str || this.originText;

        this.removeAllChildren();
        this.texts.length = 0;

        var arr = str.split('\n');
        var self = this;

        var flow = function(i, textline)
        {
            if(i != 0) {
                var bound = textline.getBounds();

                if(self.dir == 0) {
                    var _h = self.fontSize * self.lineHeight /100;
                    switch (self.reg) {
                        case 0:
                            textline.set({
                                x: 0,
                                y: (i - 1) * _h
                            });
                            break;
                        case 1:
                            textline.set({
                                x: -bound.width,
                                y: (i - 1) * _h
                            });
                            break;
                        case 2:
                            textline.set({
                                x: -bound.width,
                                y: -(i - 1) * _h
                            });
                            break;
                        case 3:
                            textline.set({
                                x: 0,
                                y: -(i - 1) * _h
                            });

                            break;
                    }
                }
                else if(self.dir == 1){
                    var _w = self.fontSize * self.lineHeight /100;
                    switch(self.reg) {
                        case 0:
                            textline.set({
                                y: 0,
                                x: (i-1) * _w
                            })
                            break;
                        case 1:
                            textline.set({
                                y: 0,
                                x: -(i-1) * _w
                            })
                            break;
                        case 2:
                            textline.set({
                                y: -bound.height,
                                x: -(i-1) * _w
                            })
                            break;
                        case 3:
                            textline.set({
                                y: -bound.height,
                                x: (i-1) * _w
                            })
                            break;
                    }
                }

                self.texts.push(textline);
                self.addChild(textline);
            }

            if(i < arr.length) {
                console.log("in ImgaeText.js, arr," + arr[i]);
                textline = new createjs.TextLine(arr[i], self.dir, self.letterSpacing, self.fontSize, self.fontFamily, self.color);
                textline.load(null, function (data) {
                    flow(i + 1, data)
                });
            }
            else
                callback(self);
        }

        flow(0);    //start loading series
    };

    createjs.ImageText = ImageText;
    return createjs.promote(ImageText, "Container");
})