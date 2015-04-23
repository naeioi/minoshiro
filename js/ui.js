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
var stepOn={
    step:1,
    mORn:1//whether a manualable template
};
var _Item={bg_manualable:false,id:1,group:0};
var namesOther=["head","deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text"];
var namesGroup=[["head","deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text"]];
var Steps=["mainThumbnail","colorset"];
//color specific by json file
function jmpStep(step)
{
    //setting ui element
    if(step<=stepProgress&&step!=2)
    {
        if(stepOn.step!=2)
        {
            $('div.pad'+stepOn.step).addClass('hidden');
            $('li.todoli'+stepOn.step).removeClass('todo-done');
            $('div.pad'+step).removeClass('hidden');
            $('li.todoli'+step).addClass('todo-done');
        }
        else
        {
            $('div.pad2'+stepOn.mORn).addClass('hidden');
            $('li.todoli2').removeClass('todo-done');
            $('div.pad'+step).removeClass('hidden');
            $('li.todoli'+step).addClass('todo-done');
        }
        stepOn.step=step;
    }
    else if(step<=stepProgress&&step==2)
    {
        if(_Item.bg_manualable==false)
        {
            $('div.pad'+stepOn.step).addClass('hidden');
            $('li.todoli'+stepOn.step).removeClass('todo-done');
            $('div.pad21').removeClass('hidden');
            $('li.todoli2').addClass('todo-done');
            stepOn.step=step;
            stepOn.mORn=1;
        }
        if(_Item.bg_manualable==true)
        {
            $('div.pad'+stepOn.step).addClass('hidden');
            $('li.todoli'+stepOn.step).removeClass('todo-done');
            $('div.pad22').removeClass('hidden');
            $('li.todoli2').addClass('todo-done');
            stepOn.step=step;
            stepOn.mORn=2;
        }
    }

    //filling toolbar
    switch(step)
    {
        case 1:
            loadThumbnail({fatherRole:"root",fatherDomain:"root"},1,Steps[0]);
            break;
        case 2:
            if(_Item.bg_manualable==true)//step into 22
            {

            }
            else
            {
                selItem("complete",loadColorSet,{fatherRole:"master",fatherDomain:namesOther[_Item.id]})
            }
            break;
        case 3:
            break;
        case 4:
            controller.output().then(function(data){
                $('a.output').attr({'download':'poster.jpg','href':data});
            })
        default:
            break;
    }

    console.log("jmpStep "+step+" succeeded");
}

function setProgress(nStep)
{
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
}

function selColor(_color)//_color is a string
{
    setProgress(2);
    controller.set_color(_color);
}

function selectedItem(nStep,nItem)//nItem is an object
{
    if(nStep==1)_Item=nItem;
    setProgress(nStep);
    var mapItem=["deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text"];
    var description={fatherRole:"master",fatherDomain:mapItem[_Item.id-1]};
    console.log("selected item "+nStep+" "+nItem);

    switch(nStep)
    {
        case 1:
            if(_Item.group=='other')
            selItem("complete",loadResource,{fatherRole:"master",fatherDomain:namesOther[_Item.id-1]})
            else
            {
                var defination={fatherRole:"master"};
                defination.fatherDomain=namesGroup[_Item.group][_Item.id];
                selItem("complete",loadResource,defination);
            }
            break;
        default:break;
    }
    function loadResource(mainJsonFile) {
        console.log("loadResource"+mainJsonFile);
        controller.load(mainJsonFile);
    }
}

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
            })
        });
    }
    console.log("loadThumbnail "+name);
    selItem(name,load,description);
}

function loadColorSet(namejson)
{
    console.log('loadColorSet');
    $.getJSON(namejson,function(json){
        $.each(json.set_name, function (key,item) {
            console.log('#color '+item);
            $('#color_'+item).addClass("colorbox-"+item);
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