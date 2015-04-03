##requireJS笔记
---------------
###一 基础
    requireJS提供三个接口
```
require
requirejs === require
define
```

    require原型为
```
require([module_name], function callback(module){
    //you code goes here
    module.hello();
})
```

require先加载module_name模块，在调用callback函数。
module将作为形参传给callback

    define原型为
```
define([dep_mod], function(module){
    //you code goes here
    module.do_a();
    return {
        hello: function(){
            return module.do_b();
        }
    }
})
```

###二 .js后缀名不须加
通过url加载js模块不需要.js后缀名(一定不要加)

例：
```
文件结构
    root/
        require.js
        mod.js
        index.html

index.html
    ...
        <script src='require.js></script>
        <script>
            require(['mod'], function(){
                mod.hello();
            });
        </script>
    ...

mod.js
    define(function(){
        return {
            hello: function(){
                alert('hello');
            }
        }
    })
```

###config设置（一）  baseUrl
baseUrl是所有js文件的基础父目录
例如，若 baseUrl == '/js', 则 require(['lib/mod.js']) 将会加载 js/lib/mod.js

当加载require.js的script标签设置了 data-main 标签时，baseUrl默认为main文件的目录
例如 <script data-main='js/main.js' src='lib/require.js> 则 baseUrl == '/js'

若没有设置 data-main, baseUrl默认为使用require.js的HTML文件的目录

也可以利用require.config显式地设置baseUrl
例如
```
文件结构
root/
    js/
        main.js
    lib/
        require.js
    index.html

index.html
    ...
    <script data-main="js/main.js' src='lib/require.js'></script>
    ...

main.js
    require.config({
        baseUrl: '/lib'
    })
```
以上设置默认目录将指向root/lib

###config设置（二）  paths
paths为模块设置名字、指定目录。
注意path[s]最后的s不能漏掉。不会有任何提示。

例子
```
文件结构
root/
    js/
        main.js
        mod.js
    lib/
        require.js
    index.html

index.html
    ...
    <script data-main='js/main.js' src='lib/require.js></script>
    ...

main.js
    require.config({
        baseUrl: '/lib',
        paths: {
            mymod: '../js/mod'  //注意此处不要写成mod.js
        }
    })
    require(['mymod', function(mymod){
        mymod.hello();
    })

mod.js
    define(function(){
        return {
            hello: function(){
                alert('hello');
            }
        }
    })
```

###config设置（三）  shim
shim可以将js文件中某一个变量暴露出来作为模块接入口使用
此功能常用来加载非AMD标准的库

例子：
```
文件结构
root/
    js/
        main.js
        mod.js
    lib/
        require.js
    index.html

index.html
    ...
    <script data-main='js/main.js' src='lib/require.js'></script>
    ...

mod.js
    var obj = {};
    obj.hello = function(){
        alert('hello');
    }

main.js
    require.config({
        paths: {
            mod: 'mod'
        }
        shim: {
            mod: { exports: 'obj' }     //将mod.js中的obj变量暴露出来作为模块接入口
        }
    }
```

###库加载的特殊情况（一）     createjs库
createjs库是一个非AMD标准的库

createjs库代码定义如下
```
...
this.createjs = this.createjs || {}
...
```

createjs并没有定义createjs变量，而是直接给window.createjs赋值。这导致下面的代码失效
```
require.config({
    shim: {
        createjs: { exports: 'createjs' }
    }
})
require(['createjs', function(createjs){
    console.log(createjs)   //console output: undefined
}
```

然而这段代码是有效的，因为createjs直接给window.createjs赋了值
```
require.config({
    shim: {
        createjs: { exports: 'createjs' }
    }
})
require(['createjs', function(){
    console.log(createjs)   //console output: undefined
}
```

为使得createjs库能像一般AMD库正常加载和工作，需要引入辅助模块createjs_private.js
例子
```
createjs_private.js
    require(['createjs', function(){
        return window.createjs;
    })

main.js
    require.config({
        map: {
            '*': {createjs: 'createjs_private'},        //将对createjs的模块跳转给createjs_private模块
            'createjs_private': {createjs: 'createjs'}  //createjs_private对createjs模块的依赖维持不变
        }
    })
    require(['createjs'], function(createjs){
        console.log(createjs);      //console output: object...
    })
```

##reference
快速理解RequireJs   http://www.tuicool.com/articles/jam2Anv