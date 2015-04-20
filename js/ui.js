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
    var maplevel=["root.json","root.json"];
    var level=["mainThumbnail","colorset"];
    if(step<=stepProgress)
    {
        $('div.pad'+stepOn).addClass('hidden');
        $('li.todoli'+stepOn).removeClass('todo-done');
        $('div.pad'+step).removeClass('hidden');
        $('li.todoli'+step).addClass('todo-done');
        stepOn=step;
    }
    loadThumbnail(maplevel[step-1],step,level[step-1]);
    //selItem(level[step-1],load,maplevel[step-1])
}
function selectedItem(nStep,nItem)
{
    var mapItem=["normal/chinese/chinese.json","normal/flat/flat.json"];
    var numberOfItem=4;
    if(nStep+1>stepProgress)stepProgress=nStep+1;
    //$('img.op'+nStep+nItem).addClass('focus');
    var curTarger = null;
    var curStr = null;
    console.log("lalala");
    if(nStep==1)
    {
        //loadResource(map[nStep-1]);
        selItem('mainDemo',loadResource,mapItem[nItem-1]);
    }
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
var loadNumber=0;
function loadThumbnail(src,item,name) {
    function load (jsonFile)
    {
        //var info=JSON.parse(json);
        $.getJSON(jsonFile,function(json) {
            console.log("Load : "+json);
            $.each(json.classes, function (key, value) {
                $('#op' + item + (loadNumber + 1)).attr('src', value);
                console.log(item);
                loadNumber+=1;
            })
        });
        //
    }
    loadNumber=0;
    selItem(name,load,src);
}

function selItem(name,func,crt)
{
    var common="templates/";
    $.getJSON(common+crt,function(json){
        if(json.isBottom==true)
        {

            if(json.name==name)
            {

                $.each(json.items,function(key,value){
                    func(value);
                });
                return 1;
            }
            else
            {
                return 0;
            }
        }
        else
        {
            $.each(json.next,function(key,value){
                selItem(name,func,value);
            });
        }

    });
}