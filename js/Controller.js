/**
 * Created by naeioi on 2015/4/3.
 */
/*
 controller:
 controller仅有一个实例，不需要写成类
 载入文件及提示进度
 功能：
 监听事件load,progress和complete，事件event = {file: ""//载入文件名}
 载入模板文件、字体文件，以对象的方式传递给model
 接口：
 load_demo(src)
 载入src指向的main.json文件，将数据存储在object中，传递给model.init()
 imageLoaer(textline)
 传入TextLine的实例，ajax请求图片数据，添加到实例中
onload(e), onprogress(e), oncomplete(e)
监听载入事件并提示进度。事件是createjs的Event类的实例
output_origin()
渲染origin并自动下载
 */

define(['createjs', 'jquery'], function(createjs, $) {
    var controller = {};
    var p = controller;

    p.trimPic = function(img, dir)
    {
        dir = dir || 0;

        var _can = document.createElement('canvas');
        var ctx = _can.getContext('2d');
        var _w = img.width, _h = img.height;
        var bitmap;

        _can.width = _w;
        _can.height = _h;

        ctx.drawImage(img, 0, 0);

        bitmap = ctx.getImageData(0, 0, _can.width, _can.height);

        function pos(x, y)
        {
            return (y*_w + x)*4 + 3;    //retrieve alpha channel
        }

        if(dir == 0){
            for(var x = _w-1; x >= 0; x--){
                var flag = false;
                for(var y = 0; y < _h; y++)
                    if(bitmap.data[pos(x,y)] != 0)
                    {
                        flag = true;
                        break;
                    }
                if(flag)
                {
                    _can.width = x+2;
                    ctx.drawImage(img, 0, 0, x+2, _h, 0, 0, x+2, _h);
                    img.src = _can.toDataURL('image/png');
                    break;
                }
            }
        }
       // else if(dir == 1){
            for(var y = _h-1; y >= 0; y--){
                var flag = false;
                for(x = 0; x < _w; x++)
                    if(bitmap.data[pos(x,y)] != 0)
                    {
                        flag = true;
                        break;
                    }
                if(flag)
                {
                    _can.height = y+2;
                    ctx.drawImage(img, 0, 0, _w, y+2, 0, 0, _w, y+2);
                    img.src = _can.toDataURL('image/png');
                    return;
                }
            }
        //}
    }


    p.imageLoader = function(t)
    {
        var def = $.Deferred();
        //def.resolve();

        var onsucess = function(data){

            /*debug
            var img_e = document.getElementById('img');
            img_e.src = data;
            */

            //here we assign base64 to img.src, so it is not necessary to treat it in async way
            var img = document.createElement('img');
            img.src = data;

            p.trimPic(img);

            //document.getElementById('test_img').src = img.src;

            def.resolve(img);
        }

        //console.log('text=' + encodeURI(t.text));

        $.ajax({
            url: 'pcs.1.1.php?'
                +'text=' + t.text
                +'&dir=' + t.dir
                +'&space=' + t.letterSpacing
                +'&font=' + t.fontFamily
                +'&size=' + t.fontSize
                +'&color=' + t.color,
            success: onsucess
        })

        return def.promise();
    }

    $(document).ajaxSend(function(event, jqhxr, setting){
        var res;
        if(!setting.url.match(/php/))
            res = setting.url.match(/[^\/]+$/);
        else
            res = 'font';
        $('#notficator').html('Loading ' + res + '...');
        $('#notificator').show();
    })

    $(document).ajaxSuccess(function(){
        $('#notificator').hide();
    })

    return controller;
})