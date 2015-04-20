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
var _Item;
function test(item)
{
    $('li.todoli'+item).addClass('todo-done');
}
function jmpStep(step)
{
    var mapItem=["chinese","flat"];
    var mapStep=["mainThumbnail","colorset"];
    if(step<=stepProgress)
    {
        $('div.pad'+stepOn).addClass('hidden');
        $('li.todoli'+stepOn).removeClass('todo-done');
        $('div.pad'+step).removeClass('hidden');
        $('li.todoli'+step).addClass('todo-done');
        stepOn=step;
    }
    var description=[{"fatherRole":"root","fatherDomain":"root"},{"fatherRole":"master","fatherDomain":mapItem[_Item-1]}];

    console.log(description[0]);
    console.log("jmpStep "+step);
    loadThumbnail(description[step-1],step,mapStep[step-1]);
}
function selectedItem(nStep,nItem)
{
    if(nStep==1)_Item=nItem;
    var mapItem=["chinese","flat"];
    var mapStep=["mainDemo","complete"];
    var numberOfItem=4;
    if(nStep+1>stepProgress)stepProgress=nStep+1;
    var curTarger = null;
    var curStr = null;
    var description={"fatherRole":"master","fatherDomain":mapItem[_Item-1]};
    console.log("selected item "+nStep+" "+nItem);
    if(nStep==1)selItem(mapStep[nStep-1],loadResource,description);
    if(nStep==2)selItem(mapStep[nStep-1],loaddemo,description);
    function loaddemo(mainJsonFile)
    {
        console.log("loaddemo "+mainJsonFile);
        $.getJSON(mainJsonFile, function (json) {
            console.log(json.demofile);
            loadResource(json.demofile[nItem]);
        });
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
function loadThumbnail(description,item,name) {
    function load (jsonFile)
    {
        //var info=JSON.parse(json);
        $.getJSON(jsonFile,function(json) {
            console.log("Load : "+json);
            $.each(json.classes, function (key, value) {
                $('#op' + item + (loadNumber + 1)).attr('src', value);
                console.log(value);
                loadNumber+=1;
            })
        });
        //
    }
    loadNumber=0;
    console.log("loadThumbnail "+name);
    selItem(name,load,description);
}

function dfs(name,func,obj,description)
{
    console.log("description "+description.fatherDomain);
    if(obj.isBottom==true)
    {
        if(obj.name==name)
        {
            $.each(obj.next,function(key,value){
                console.log("step into "+ value);
                func(value);
            })
        }
    }
    else if(obj.role==description.fatherRole)
    {
        if(obj.domain==description.fatherDomain)
        {
            $.each(obj.next,function(key,value){
                console.log("step into "+ value.role);
                dfs(name,func,value,description);
            })
        }
    }
    else
    {
        $.each(obj.next,function(key,value){
            console.log("step into "+ value.role);
            dfs(name,func,value,description);
        })
    }
}
function selItem(name,func,description)
{
    var structure="templates/structure.json";
    console.log("selItem "+name);
    $.getJSON(structure, function (json) {
        console.log("get json"+name);
       $.each(json.next,function(key,value){
           dfs(name,func,value,description);
       })
    })
}