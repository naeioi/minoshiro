/**
 * Created by naeioi on 2015/4/3.
 */
define(['createjs', 'jquery'], function(createjs, $){
    return {
        init: function(){
            console.log('message from test');
            console.log(createjs);
        },
        test_jquery: function(){
            console.log($);
            console.log($.ajax);
        }
    }
})