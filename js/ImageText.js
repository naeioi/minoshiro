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
    function ImageText(originText, reg, dir, space, size, family, color, lineSpacing)
    {
        this.Container_constructor();

        this.originText = originText || "";
        this.reg = reg || 0;
        this.dir = dir || 0;
        this.letterSpacing = space || 0;
        this.lineSpacing = 0;
        this.fontSize = size || 20;
        this.fontFamily = family || "";
        this.color = color || "000000";
        this.lineHeight = 220;  //___% of font-size

        this.texts = [];
        this.name = "ImageText";    //click事件冒泡到model时用于判断是否是点击了文字
        this.res_text = null;   //指向template中res的text的引用，修改imagetext的内容时应该先修改res_text中的
    }

    var p = createjs.extend(ImageText, createjs.Container);

    p.imageLoder = new Function();

    p.load = function(str)
    {
        var def = $.Deferred();
        def.resolve();

        str = str || this.originText;

        //this.removeAllChildren();
        this.texts.length = 0;

        if(this.res_text) {
            this.res_text.content = str;
            this.res_text.size = this.fontSize / (this.parent.template.res.demo_width / this.parent.template.res.origin_width);
        }

        var arr = str.split('\n');
        var textline_arr = []
        var self = this;

        for(var i = 0; i < arr.length; i++) {
            //console.log("in ImgaeText.js, arr," + arr[i]);

            // (IMPORTANT) use closure to save textline for each step of loop
            (function(i) {
                var textline = new createjs.TextLine(arr[i] || " ", self.dir, self.letterSpacing, self.fontSize, self.fontFamily, self.color);

                def = def.then(function () {
                    return textline.load();
                });
                def.done(function(textline){
                    textline_arr.push(textline);
                    //setAttr(i, textline);
                });
            }(i));
        }

        def = def.then(function(){
            self.removeAllChildren();
            for(var i = 0; i < arr.length; i++)
                setAttr(i, textline_arr[i])
        })

        var setAttr= function(i, textline) {

            //console.log("in setAttr");
            //console.log(textline);

            //add this line to deal with click event
            textline.father = self;

            self.texts.push(textline);
            self.addChild(textline);

            textline.addEventListener('click', function(e){
                //e.stopPropagation();
                //self.dispatchEvent('click');
            })

            var bound = textline.getBounds();

            if (self.dir == 0) {
                var _h = self.fontSize * self.lineHeight / 100;
                var n = arr.length;
                switch (self.reg) {
                    case 0:
                        textline.set({
                            x: 0,
                            y: i * _h
                        });
                        break;
                    case 1:
                        textline.set({
                            x: -bound.width,
                            y: i * _h
                        });
                        break;
                    case 2:
                        textline.set({
                            x: -bound.width,
                            y: -(n-i-1) * _h
                        });
                        break;
                    case 3:
                        textline.set({
                            x: 0,
                            y: -(n-i-1) * _h
                        });
                        break;
                    case 4:
                        textline.set({
                            x: -bound.width / 2,
                            y: i * _h
                        });
                        break;
                }
            }
            else if (self.dir == 1) {
                var _w = self.fontSize * self.lineHeight / 100;
                switch (self.reg) {
                    case 0:
                        textline.set({
                            y: 0,
                            x: i * _w
                        })
                        break;
                    case 1:
                        textline.set({
                            y: 0,
                            x: -i * _w
                        })
                        break;
                    case 2:
                        textline.set({
                            y: -bound.height,
                            x: -i * _w
                        })
                        break;
                    case 3:
                        textline.set({
                            y: -bound.height,
                            x: i * _w
                        })
                        break;
                    case 4:
                        textline.set({
                            y: -bound.height / 2,
                            x: i * _w
                        })
                }
            }
        }

        return def;
    };

    p.change = function(argv){
        if(typeof argv === 'string') {
            argv = argv || " ";
            if (argv != this.originText) {
                this.originText = argv;
                this.load();
            }
        }else if(typeof argv === 'object'){
            var flag = false;
            for(var i in argv){
                if(argv.hasOwnProperty(i) && this.hasOwnProperty(i) && this[i] != argv[i]){
                    this[i] = argv[i];
                    flag = true;
                }
            }
            if(flag)
                this.load();
        }
    }

    createjs.ImageText = ImageText;
    return createjs.promote(ImageText, "Container");
})