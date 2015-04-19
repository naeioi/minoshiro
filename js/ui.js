function setProgressBar(step)
{
    var showProgress=step*25;
    $('div.pb1').css("width",showProgress+'%');
}
function jmpStepSm(step)
{
    if(step<=stepProgress)
    {
        $('div.pad'+stepOn).addClass('hidden');
        $('button.todobtn'+stepOn).removeClass('todo-done');
        $('div.pad'+step).removeClass('hidden');
        $('button.todobtn'+step).addClass('todo-done');
        stepOn=step;
    }
}
function selectedItemSm(nStep,nItem)
{
    var numberOfItem=4;
    if(nStep+1>stepProgress)stepProgress=nStep+1;
    setProgressBar(nStep);
    //$('img.op'+nStep+nItem).addClass('focus');
    for(var i=1;i<=numberOfItem;i++)
    {
        if(i>stepProgress)
        {
            if(!($('button.todobtn'+i).hasClass('disabled')))
            {
                $('li.li'+i).addClass('disabled');
            }
        }
        else if(i<=stepProgress)
        {
            if(($('button.todobtn'+i).hasClass('disabled')))
            {
                $('button.todobtn'+i).removeClass('disabled');
            }
        }
    }
    if(nItem!=-1)
    {
        $('img.mainCanvas').attr('src','pics/theme'+nItem+'.jpg');
    }
}
var stepProgress=1;//start from 1
var stepOn=1;
function init()
{
    for(var i=1;i<=4;i++)
    {
    }
}
function test(item)
{
    $('li.todoli'+item).addClass('todo-done');
}
function jmpStep(step)
{
    if(step<=stepProgress)
    {
        $('div.pad'+stepOn).addClass('hidden');
        $('li.todoli'+stepOn).removeClass('todo-done');
        $('div.pad'+step).removeClass('hidden');
        $('li.todoli'+step).addClass('todo-done');
        stepOn=step;
    }
    loadThumbnail("templates/classes.json",step);
}
function selectedItem(nStep,nItem)
{
    var map=["templates/classes/chinese.json"];
    var numberOfItem=4;
    if(nStep+1>stepProgress)stepProgress=nStep+1;
    //$('img.op'+nStep+nItem).addClass('focus');
    loadResource(map[nStep-1]);
    function loadResource(mainJsonFile) {
        controller = new Controller('canvas');
        controller.load(mainJsonFile);
        var curTarger = null;
        var curStr = null;
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
    }
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

function loadThumbnail(src,item) {
    $.getJSON(src,function(json)
    {
        //var info=JSON.parse(json);
        //console.log(json);
        $.each(json.classes,function(key,value)
        {
            $('#op'+1+(key+1)).attr('src','templates/classes/'+value);
            console.log(value);
        })
        //
    });
}
