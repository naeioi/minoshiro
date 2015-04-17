Template类
---------------
一张海报的数据存储在template类的实例中。
三层结构：
    0 template.res 原始数据，全部为字符串&数字
    1 template     加载后数据
    2 model        放到createjs内数据
修改任何内容必须自低向上逐层修改
```
template = {
    width: @integer,
    height: @integer,
    bg: [{
        src: @Image,
        x, y, scaleX, scaleY: @float
    }]  @array
    elements: [{
        src: @Image,
        x, y, scaleX, scaleY: @float
    }]
    texts: [{
        color, family, text: @string
        reg, dir, space, size: @integer
    }]
}
```