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
    loadThumbnail("templates/classes.json",1);
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
})