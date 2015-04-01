#模板文件结构

-------------
```
templates/	//模板目录
	class.json
	class1/		//模板文件夹1
	class2/		//模板文件夹2
	...
	
class.json	//模板分类清单, json格式
	例：[{name: "商务", src: "bussiness/", description: ""},
		 {name: "简约", src: "simplicity/", description: ""}]

class1/		//分类文件夹
	manifest.json
	item1/
	item2/
	...
	
manifest.json	//分类下模板清单
	例：[{name: "北大清风" ,src: "pku_1/", description: "",
		  size: "1200x800"}, ... ]

item1/		//模板文件夹
	main.json
	thumbnail.png	//缩略图
	demo/		//用于演示的资源
	origin/		//用于生成成品的资源
	
main.json	//模板主文件，记录背景、组件、文字信息
	{
		demo_width:960 , demo_height: 400,
		origin_width: 9600, origin_height: 4000,
		bg: {
				manualable: false	//是否可手动设置背景
				src: ["bg1.png","bg2.png", ... ],	//默认背景，可能有多种
		},
		elements: [element1, element2, ... ],	//各部件数组，每个element是一个JS对象，下面描述
		texts: [text1, text2, ... ]		//文字数组，每个text是一个JS对象，下面描述
	}

//element描述
element = {
		src: "shape.png",	//该部件文件
		x: 30, y: 30, regX: 0, regY: 0 , ...	//其他属性同easelJS
}

//text描述
text = {
		font: "Courier_New",	//字体名字
		content: "Study in Germany\nLand of Ideas",	//文字内容，可以有\n
		size: 14	//字体大小数值表示
		style: "bold"	//字形(bold, italic, etc)
		dir:0,	//方向，0横1竖
		reg: 1,		//参考点。0左上1右上2右下3左上。参考点坐标不变，由x,y属性给出
		letter-spacing:0	//字符间距
		x:y:regX:....	//其他属性同easelJS
}
```