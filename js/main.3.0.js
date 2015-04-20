/**
 * Created by naeioi on 2015/4/18.
 */
requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-2.1.3.min'
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});

require(['Controller'], function() {
    //loadThumbnail("templates/classes.json",1);
    /*
    setInterval(function(){
        var str = $('#textarea').val();
        if(curTarger != null && str != curStr){
            curStr = str;
            curTarger.change(str);
        }
    }, 0.2)
    $('#btnspecific').click(function(){
        controller.output().then(function(data){
            location.href = data;
        })
    })*/

    function selectedItem(nStep,nItem)
    {
        var map=["templates/classes/chinese.json","templates/classes/chinese.json","templates/classes/chinese.json"];
        var numberOfItem=4;
        if(nStep+1>stepProgress)stepProgress=nStep+1;
        //$('img.op'+nStep+nItem).addClass('focus');
        var curTarger = null;
        var curStr = null;
        console.log("lalala");
        if(nStep==1)
        //loadResource(map[nStep-1]);
            selItem('mainThumbnail',loadResource,"root.json");
        function loadResource(mainJsonFile) {
            controller = new Controller('canvas');
            controller.load(mainJsonFile);
        }
        $(controller).click(function(e){
            curTarger = e.targer;
            curStr = e.text;
            $('#textarea').val(curStr);
        })
        setInterval(function(){
            var str = $('#textarea').val();
            if(curTarger != null && str != curStr){
                curStr = str;
                curTarger.change(str);
            }
        }, 0.2)
        $('#btnspecific').click(function(){
            controller.output().then(function(data){
                location.href = data;
            })
        })
        for(var i=1;i<=numberOfItem;i++)
        {
            if(i>stepProgress)
            {
                if(!($('li.todoli'+i).hasClass('disabled')))
                {
                    $('li.li'+i).addClass('disabled');
                }
            }
            else if(i<=stepProgress)
            {
                if(($('li.todoli'+i).hasClass('disabled')))
                {
                    $('li.todoli'+i).removeClass('disabled');
                }
            }
        }
        if(nItem!=-1)
        {
            $('img.mainCanvas').attr('src','pics/theme'+nItem+'.jpg');
        }
    }
})