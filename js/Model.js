/**
 * Created by naeioi on 2015/4/8.
 */
define(['createjs', 'jquery', 'ImageText', 'Template'], function(createjs, $){
    function Model(){
        this.Container_constructor();
        this.bgBitmap = null;
    }

    var p = createjs.extend(Model, createjs.Container);

    //put template into container
    //bind res to texts at the same time
    p.put = function() {

        this.removeAllChildren();

        var self = this;
        var t = self.template;

        //put bg
        if(t.bg) {
            var bg = t.bg;
            var bitmap = new createjs.Bitmap(bg.img);
            bitmap.set({
                x: bg.x,
                y: bg.y,
                scaleX: bg.scaleX || 1,
                scaleY: bg.scaleY || 1
            })
            self.bgBitmap = bitmap;
            //THIS IS A TEST
            //bitmap.alpha = 0.3;
            //--------------
            self.addChild(bitmap);
        }

        //put elements
        for (var i = 0; i < t.elements.length; i++) {
            var element = t.elements[i];
            var bitmap = new createjs.Bitmap(element.img);
            bitmap.set({
                x: element.x,
                y: element.y,
                scaleX: element.scaleX || 1,
                scaleY: element.scaleY || 1
            })
            self.addChild(bitmap);
        }

        //put texts;
        for (var i = 0; i < t.texts.length; i++) {
            var imgtext = t.texts[i];
            imgtext.res_text = t.res.texts[i];
            self.addChild(imgtext);
            //self.stage.update();
            //imgtext.dispatchEvent('click');
        }

        //put manual_bg
        if(t.manual_bg){
            var bitmap = new createjs.Bitmap(t.manual_bg.img);

            bitmap.set({
                x: t.manual_bg.x,
                y: t.manual_bg.y,
                scaleX: t.manual_bg.scaleX * t.res.manual_bg.scaleX,
                scaleY: t.manual_bg.scaleY * t.res.manual_bg.scaleY,
                compositeOperation: "destination-over"
            })

            self.addChild(bitmap);
            if(self.stage && self.stage.update)
                self.stage.update();
            self.bindTrans(bitmap);
        }
    }

    //read main.json and load template
    p.load = function(src, mode)
    {
        var self = this;
        var t = new createjs.Template();
        var rootUrl = src.match(/^\S+\//);

        this.template = t;
        this.rootUrl = rootUrl;

        var def = $.get(src);
        //console.log("begin load template");
        //console.log(src);

        //load template
        def = def.then(function(res){
            //console.log("load done");
            return t.load(rootUrl, res, mode);
        })

        //add all staff into container
        def = def.then(function(){
            self.put();
        })

        return def.promise();
    }

    p.set_color = function(colorset){
        var def = this.template.set_color(colorset);
        var self = this;
        def = def.then(function(){
            //console.log(this.template);
            self.put();
        })
        return def.promise();
    }

    p.output = function(){
        var oriModel = new createjs.Model();
        var oriTemplate = new createjs.Template();
        var whiteBG = new createjs.Shape();
        var def;

        oriModel.template = oriTemplate;
        def = oriTemplate.load(this.rootUrl, this.template.res, 'origin');
        def = def.then(function(){
            whiteBG.graphics.beginFill('white')
                .drawRect(0, 0, oriTemplate.width, oriTemplate.height);
            oriModel.put();
            //oriModel.addChildAt(whiteBG, 0);
            oriModel.cache(0, 0, oriTemplate.width, oriTemplate.height);
            //console.log(oriModel.cacheCanvas.toDataURL('image/png'));
            return oriModel.cacheCanvas.toDataURL('image/png');
        })

        return def.promise();
    }

    p.bindTrans = function(obj){
        obj.cursor = "move";

        var self = this;
        var t = this.template.manual_bg;
        var res = this.template.res.manual_bg;

        var bound = obj.getBounds();
        var border = new createjs.Container();

        var scaleX = this.template.res.demo_width / this.template.res.origin_width;
        var scaleY = this.template.res.demo_height / this.template.res.origin_height;

        var rect = new createjs.Shape(), round = new createjs.Shape();

        border.addChild(rect);
        border.addChild(round);

        var set = function() {

            //border.removeAllChildren();

            rect.graphics.clear();
            round.graphics.clear();

            obj.hitArea = new createjs.Shape();
            obj.hitArea.graphics.beginFill("black")
                .drawRect(-7 / scaleX, -7 / scaleX, bound.width + 14 / scaleX, bound.height + 14 / scaleX);

            rect.graphics.setStrokeStyle(1, 0, 2, 1)
                .beginStroke("#0055FF")
                .drawRect(-0.5, 0, Math.floor(bound.width * obj.scaleX + 2), Math.floor(bound.height * obj.scaleY + 1));
            round.graphics.beginFill("#66CCFF")
                .drawRect(bound.width * obj.scaleX - 3, bound.height * obj.scaleY - 3, 5, 5);

            round.hitArea = new createjs.Shape();
            round.hitArea.graphics.beginFill("black").drawRect(bound.width * obj.scaleX - 13, bound.height * obj.scaleY - 13, 20, 20);
            round.cursor = "nw-resize";
            border.set({
                x: obj.x,
                y: obj.y,
                scaleX: 1,
                scaleY: 1
            })
        }

        set();

        //var ind = self.getChildIndex(obj) - 1;
        round.addEventListener('mouseover', function(){
            self.bgBitmap.alpha = 0.3;
            self.addChild(border);
        })

        round.addEventListener('mouseout', function(){
            self.bgBitmap.alpha = 1;
            self.removeChild(border);
        })

        round.addEventListener('mousedown', function(e){
            //console.log('mousedown');

            var x0 = e.stageX, y0 = e.stageY;
            var x1 = (obj.x + bound.width  * obj.scaleX) * self.scaleX;
            var y1 = (obj.y + bound.height * obj.scaleY) * self.scaleY;

            //console.log('x0='+x0);
            //console.log('y0='+y0);
            var onpressmove = function(e){
                //console.log('pressmove');
                var dx = e.stageX - x0, dy = e.stageY - y0;
                //console.log('dx='+dx);
                //console.log('dy='+dy);
                obj.scaleX = ((x1+dx)/self.scaleX-obj.x) / bound.width;
                obj.scaleY = ((y1+dy)/self.scaleY-obj.y) / bound.height;
                res.scaleX = obj.scaleX / scaleX;
                res.scaleY = obj.scaleY / scaleY;
                set();
            }

            var onpressup = function(e){
                //console.log('pressup');
                self.stage.removeAllEventListeners();
            }

            self.stage.addEventListener('pressmove', onpressmove);
            self.stage.addEventListener('pressup', onpressup);

            $('#canvas').mouseleave(function(){
                self.stage.dispatchEvent('pressup');
            })
        })

        /*
         round.addEventListener('mousedown', function(e){
         round.pos = { x: e.stageX, Y: e.stageY };
         })

         round.addEventListener('mousemove', function(){
         obj.scaleX = (e.stageX - round.pos.x)/bound.width + obj.scaleX;
         obj.scaleY = (e.stageY - round.pos.y)/bound.height + obj.scaleY;
         round.pos = { x: e.stageX, Y: e.stageY };
         set();
         })
         */
        obj.addEventListener('mouseover', function(){
            self.bgBitmap.alpha = 0.3;
            self.addChild(border);
        })

        obj.addEventListener('mouseout', function(){
            self.bgBitmap.alpha = 1;
            self.removeChild(border);
        })

        obj.addEventListener('mousedown', function(e){
            var x0 = e.stageX, y0 = e.stageY;
            var x1 = res.x, y1 = res.y;
            obj.addEventListener('pressmove', function(e){
                var dx = e.stageX - x0, dy = e.stageY - y0;
                res.x = x1 + dx / scaleX / self.scaleX;
                res.y = y1 + dy / scaleY / self.scaleY;
                obj.x = res.x * scaleX;
                obj.y = res.y * scaleY;
                border.x = obj.x - 1;
                border.y = obj.y - 1;
            })
        })
        /*
         obj.addEventListener('mousedown', function(e){
         res.offset = { x: obj.x - e.stageX, y: obj.y - e.stageY};
         obj.offset = { x: obj.x - e.stageX, y: obj.y - e.stageY};
         border.offset = { x: border.x - e.stageX, y: border.y - e.stageY};
         })

         obj.addEventListener('pressmove', function(e){
         res.x = (e.stageX + res.offset.x) / scaleX;
         res.y = (e.stageY + res.offset.y) / scaleY;
         obj.x = e.stageX + obj.offset.x;
         obj.y = e.stageY + obj.offset.y;
         t.x = obj.x; t.y = obj.y;
         border.x = e.stageX + border.offset.x;
         border.y = e.stageY + border.offset.y;
         })
         */
    }

    p.set_bg = function(url) {
        //Model.manual_bg @Bitmap is a reference to the manual_bg in Model.child
        //Template.manual_bg @Object = {img: img, x:.. , y:.. }
        //Template.res.manual_bg @Object = {img: img, x:.. , y:..}
        //note that in res.manual_bg there is an original scale
        //in template.manual_bg, img x y have another scale for display
        var self = this;
        var t = self.template;
        var res = t.res;

        if(this.manual_bg) {
            this.removeChild(this.manual_bg);
            if(this.stage) this.stage.update();
        }

        var def = t.set_bg(url);
        def = def.then(function(){
            var bitmap = new createjs.Bitmap(t.manual_bg.img);
            self.manual_bg = bitmap;

            bitmap.set({
                x: t.manual_bg.x,
                y: t.manual_bg.y,
                scaleX: t.manual_bg.scaleX * res.manual_bg.scaleX,
                scaleY: t.manual_bg.scaleY * res.manual_bg.scaleY,
                compositeOperation: "destination-over"
            })

            self.addChild(bitmap);
            self.bindTrans(bitmap);

            var hint = new createjs.Shape();
            hint.graphics.beginFill('gray')
                .drawRect(0, 0, t.manual_bg.img.width, t.manual_bg.img.height);

            hint.set({
                x: bitmap.x,
                y: bitmap.y,
                scaleX: t.manual_bg.scaleX * res.manual_bg.scaleX,
                scaleY: t.manual_bg.scaleY * res.manual_bg.scaleY,
                alpha: 0.3
            })

            hint.addEventListener('rollover', function(){
                self.removeChild(hint);
            })

            self.addChild(hint);
        })

        return def.promise();
    }

    createjs.Model = Model;
    return createjs.promote(Model, "Container");
})