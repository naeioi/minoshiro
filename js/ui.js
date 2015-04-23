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
var mORn=1;
function test(item)
{
    $('li.todoli'+item).addClass('todo-done');
}
function jmpStep(step)
{
    var mapStep=["mainThumbnail","colorset"];
    var mapItem=["deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text"];
    var mapcolor=["green","red","blue","yellow","qing"];
    if(step<=stepProgress&&step!=2)
    {
        if(stepOn!=2)
        {
            $('div.pad'+stepOn).addClass('hidden');
            $('li.todoli'+stepOn).removeClass('todo-done');
            $('div.pad'+step).removeClass('hidden');
            $('li.todoli'+step).addClass('todo-done');
        }
        else
        {
            $('div.pad'+stepOn+mORn).addClass('hidden');
            $('li.todoli'+stepOn).removeClass('todo-done');
            $('div.pad'+step).removeClass('hidden');
            $('li.todoli'+step).addClass('todo-done');
        }
        stepOn=step;
    }
    var description=[{"fatherRole":"root","fatherDomain":"root"},{"fatherRole":"master","fatherDomain":mapItem[_Item-1]}];
    console.log(description[step-1]);
    console.log("jmpStep "+step);
    if(step==1)
    {
        _Item=0;
        loadThumbnail(description[step-1],step,mapStep[step-1]);
    }
    if(step==2)
    {
        if(_Item>4)
        {
            $('div.pad1').addClass('hidden');
            $('li.todoli1').removeClass('todo-done');
            $('div.pad21').removeClass('hidden');
            $('li.todoli2').addClass('todo-done');
            stepOn=step;
            selItem("colorset",loadColorSet,description[1]);
            mORn=1;
        }
        else
        {
            $('div.pad1').addClass('hidden');
            $('li.todoli1').removeClass('todo-done');
            $('div.pad22').removeClass('hidden');
            $('li.todoli2').addClass('todo-done');
            stepOn=step;
            mORn=2;
        }
        stepProgress=3;
        for(var i=1;i<=4;i++)
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
    }
    if(step==4)
    {
        controller.output().then(function(data){
            $('a.output').attr({'download':'poster.jpg','href':data});
        })
    }
}
function selectedItem(nStep,nItem)
{
    if(nStep==1)_Item=nItem;
    var numberOfItem=4;
    if(nStep+1>stepProgress)stepProgress=nStep+1;
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
    var mapItem=["deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text"];
    var mapcolor=["green","red","blue","yellow","qing"];
    var description={"fatherRole":"master","fatherDomain":mapItem[_Item-1]};
    console.log("selected item "+nStep+" "+nItem);
    if(nStep==1)selItem("complete",loadResource,description);
    if(nStep==2)
    {
        controller.set_color(mapcolor[nItem-1]);
    }
    function loadResource(mainJsonFile) {
        console.log("loadResource"+mainJsonFile);
        controller.load(mainJsonFile);
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
                if(json.class=="other")
                $('#' + json.class + json.id).attr('src', value);
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
function loadColorSet(namejson)
{
    var i=1;
    console.log('loadColorSet');
    $.getJSON(namejson,function(json){
        $.each(json.nameArray, function (key,item) {
            console.log('#color1'+i+item);
            $('#color1'+i).addClass(item);
            i++;
        });
    });

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
