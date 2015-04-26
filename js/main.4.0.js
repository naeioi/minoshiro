/**
 * Created by huyueyu on 15/4/23.
 */

requirejs.config({
    paths: {
        'createjs': '../lib/easeljs-0.8.0.combined',
        'jquery': '../lib/jquery-2.1.3.min',
        'jqueryui':'../lib/jquery-ui'
    },
    map: {
        '*': {'createjs': 'createjs_private'},
        'createjs_private': {'createjs': 'createjs'}
    }
});

require(['Controller','jqueryui','jquery'], function() {


    controller = new Controller('canvas');
    var curTarget = null;
    var curStr = null;
    var curX = null;
    var curY = null;
    var curSize = null;

    $(controller).click(function(e){
        curTarget = e.target;
        curStr = e.originText;
        curX = e.x;
        curY = e.y;
        curSize = e.fontSize;
    });

    $('#h-slider').slider({
        max:300,
        min:0,
        animate:"fast",
        change:function(event,ui){
            curTarget.change({
                fontSize:ui.value
            });
            $('#sizeshow').text(ui.value);
        }
    });

    setInterval(function(){
        var str = $('#textarea').val();
        if(curTarget != null && (str != curStr)){
            curStr = str;
            curTarget.change({
                originText: str
            });
        }
    }, 0.2);

    $(controller).click(function(e){
        curTarget = e.target;
        curStr = e.originText;
        $('#textarea').val(curStr);
    });

    $('#btnspecific').click(function(){
        controller.output().then(function(data){
           // console.log(data);
        })
    });

    $('#fileSelect').change(function(e){
        controller.set_bg(e.target.files[0]);
    });

    var stepProgress=1;//start from 1
    var stepOn={
        step:1,
        mORn:1//whether a manualable template
    };
    var _Item={bg_manualable:false,id:1,group:0};
    var namesOther=["head","deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text","center-pic","chinese","triangle"];
    var namesGroup=[["head","deep_bg_pure_text","half_pic_column","half_pic_row","light_bg_pure_text","center-pic","chinese","triangle"],
        ["head","blur_dark","blur_light"],["flat_baijiang","flat_boya","flat_huabiao","flat_library"],
        ["head","full_column","full_recuit","full_row1","full_row2","full_square","full_tradition"],
        ["head","shuimo","shuimoB"]
    ];
    var colors=["green","blue","red","yellow","black","qing","xing","brown","white","light1","light2","light3","light4","dark1","dark2","dark3","dark4","hc","hl","lz"];
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
                $('div.pad2').addClass('hidden');
                $('li.todoli2').removeClass('todo-done');
                $('div.pad'+step).removeClass('hidden');
                $('li.todoli'+step).addClass('todo-done');
            }
            stepOn.step=step;
        }
        else if(step<=stepProgress&&step==2)
        {
            console.log(_Item.bg_manualable);
            console.log(_Item.group);
            console.log(_Item.id);
            /*
            if(_Item.bg_manualable==false)
            {
                $('div.pad'+stepOn.step).addClass('hidden');
                $('li.todoli'+stepOn.step).removeClass('todo-done');
                $('div.pad21').removeClass('hidden');
                $('li.todoli2').addClass('todo-done');
                stepOn.step=step;
                stepOn.mORn=1;
            }
            else
            {
                $('div.pad'+stepOn.step).addClass('hidden');
                $('li.todoli'+stepOn.step).removeClass('todo-done');
                $('div.pad22').removeClass('hidden');
                $('li.todoli2').addClass('todo-done');
                stepOn.step=step;
                stepOn.mORn=2;
            }
            */
            $('div.pad'+stepOn.step).addClass('hidden');
            $('li.todoli'+stepOn.step).removeClass('todo-done');
            $('div.pad2').removeClass('hidden');
            $('li.todoli2').addClass('todo-done');
            stepOn.step=step;

            if(_Item.bg_manualable==true)
            {
                if($("#switch").hasClass('hidden'))
                {
                    $("#switch").removeClass('hidden');
                }
            }
            else
            {
                if(!$("#switch").hasClass('hidden'))
                {
                    $("#switch").addClass('hidden');
                }
            }

        }

        //filling toolbar
        switch(step)
        {
            case 1:
                $('#touch2 div > div').removeClass();
                loadThumbnail({fatherRole:"root",fatherDomain:"root"},1,Steps[0]);
                break;
            case 2:
                if(_Item.bg_manualable==true)//step into 22
                {

                }
                else
                {
                   // console.log("load color set "+namesGroup[_Item.group][_Item.id]);
                    selItem("complete",loadColorSet,{fatherRole:"master",fatherDomain:namesGroup[_Item.group][_Item.id]});
                }
                break;
            case 3:
                break;
            case 4:
                controller.output().then(function(data){
                    $('a.output').removeClass('disabled');
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
        //var description={fatherRole:"master",fatherDomain:mapItem[_Item.id-1]};
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
            //console.log("loadResource"+mainJsonFile);
            controller.load(mainJsonFile);
        }
    }

    var _blur=["_dark","_light"];
    var _other=["deep_bg_pure_text","half_pic_column","half_pic_row","light_pure_text","center-pic","chinese","triangle"];
    var _flat=["_baijiang","_boya","_huabiao","_library"];
    var _full=["_column","_recuit","_row1","_row2","_square","_tradition"];
    var _shuimo=["","B"];
    function loadThumbnail(description,item,name) {
        function load (jsonFile)
        {
            //var info=JSON.parse(json);
            $.getJSON(jsonFile,function(json) {
                //console.log("Load : "+json);
                $.each(json.classes, function (key, value) {
                    switch(json.class)
                    {
                        case "other":
                            $('#' + json.class + json.id).attr('src', value);
                            break;
                        case "blur":
                            $('#' + json.class + _blur[json.id-1]).attr('src', value);
                            break;
                        case "flat":
                            $('#' + json.class + _flat[json.id-1]).attr('src', value);
                            break;
                        case "full":
                            $('#' + json.class + _full[json.id-1]).attr('src', value);
                            break;
                        case "shuimo":
                            $('#' + json.class + _shuimo[json.id-1]).attr('src', value);
                            break;
                        default:break;
                    }
                    //console.log('#' + value);
                })
            });
        }
        //console.log("loadThumbnail "+name);
        selItem(name,load,description);
    }

    function loadColorSet(namejson)
    {
       // console.log('loadColorSet');
        $.getJSON(namejson,function(json){
            $.each(json.set_name, function (key,item) {
                //console.log('#color '+item);
                $('#color_'+item).addClass("colorbox-"+item);
            });
        });

    }
    function dfs(name,func,obj,description)
    {
        //console.log("description "+description.fatherDomain);
        if(obj.isBottom==true)
        {
            if(obj.name==name)
            {
                $.each(obj.next,function(key,value){
                   // console.log("step into "+ value);
                    func(value);
                })
            }
        }
        else if(obj.role==description.fatherRole)
        {
            if(obj.domain==description.fatherDomain)
            {
                $.each(obj.next,function(key,value){
                    //console.log("step into "+ value.role);
                    dfs(name,func,value,description);
                })
            }
        }
        else
        {
            $.each(obj.next,function(key,value){
                //console.log("step into "+ value.role);
                dfs(name,func,value,description);
            })
        }
    }
    function selItem(name,func,description)
    {
        var structure="templates/structure.json";
       // console.log("selItem "+name);
        $.getJSON(structure, function (json) {
            //console.log("get json"+name);
            $.each(json.next,function(key,value){
                dfs(name,func,value,description);
            })
        })
    }
    var isManualble=[
        [false,true,true,false,true,false,true],
        [false,false],
        [false,false,false,false],
        [true,true,true,true,true,true],
        [false,false]
    ]
    $.each(namesOther,function(i,item){
        i++;
        $('#other'+i).bind('click',function(e){
            var manualble=isManualble[0][i-1];
            var describe={bg_manualable:manualble,id:i,group:0};
            selectedItem(1,describe);
        });
    });

    $.each(namesGroup,function(i,item)
    {
        if(i!=0)
        $.each(item,function(j,name){
            if(name!="head")
            {
                $('#'+name).bind('click',function(e)
                {
                    selectedItem(1,{bg_manualable:isManualble[i][j-1],id:j,group:i});
                });
            }
        });
    });

    $.each(colors,function(i,item){
        $('#color_'+colors[i]).bind('click',function(e){
            selColor(colors[i]);
        });
    });

    $.each([1,2,3,4],function(i,item){
        $('#todoli'+item).bind('click',function(e){
            //console.log("todoli " +item);
            jmpStep(item);
        });
    });

    $('#textarea').bind('click',function(e)
    {
        setProgress(3);
    });

    $('#touch1').bind('click',function(e)
    {
        setProgress(2);
    });
    $('#touch2').bind('click',function(e)
    {
        setProgress(2);
    });
    $('#touch3').bind('click',function(e)
    {
        setProgress(3);
    });

    jmpStep(1);


});
