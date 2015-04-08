Template类
---------------
一张海报的数据存储在template类的实例中。

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