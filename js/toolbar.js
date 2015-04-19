
var progress=2;
var itemOn=0;
var itemProgress=0;
$(document).ready(function init(){
    itemOn=-1;
    itemProgress=0;
});
function func(step)
{
    progress=step*25;
    $('div.pb1').css("width",progress+'%');
}
function switchtab(item)
{
    var numberOfItem=4;
    if(item>itemProgress)itemProgress=item;
    for(var i=0;i<numberOfItem;i++)
    {
        if(i==item)
        {
            $('div.item'+i).removeClass('hidden');
            $('li.li'+i).addClass('active');
        }
        if(i==itemOn)
        {
            $('div.item'+i).addClass('hidden');
            $('li.li'+i).removeClass('active');
        }
    }
    itemOn=item;
}
function selectedItem(itemTab)
{
    var numberOfItem=4;
    if(itemTab>itemProgress)itemProgress=itemTab;
    for(var i=0;i<numberOfItem;i++)
    {
        if(i>itemProgress)
        {
            if(!($('li.li'+i).hasClass('disabled')))
            {
                $('li.li'+i).addClass('disabled');
            }
        }
        else if(i<=itemProgress)
        {
            if(($('li.li'+i).hasClass('disabled')))
            {
                $('li.li'+i).removeClass('disabled');
            }
        }
    }
    func(itemTab);
}
function myalert()
{
    alert('warning');
}