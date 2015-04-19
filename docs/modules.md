#前端模块
-------------
###主模块
```
controller:	
	controller仅有一个实例，不需要写成类
	载入文件及提示进度
	功能：
		监听事件load,progress和complete，事件event = {file: ""//载入文件名}
		载入模板文件、字体文件，以对象的方式传递给model
	接口：
		load_demo(src)
			载入src指向的main.json文件，将数据存储在object中，传递给model.init()

		/*  移动功能到ImageText类中
		load_text(text)
			向服务器请求text并返回一个ImageText类的实例。注意text也是一个ImageText实例，只有文字数据没有图片数据。
		*/

		onload(e), onprogress(e), oncomplete(e)
			监听载入事件并提示进度。事件是createjs的Event类的实例
		output_origin()
			渲染origin并自动下载

model:
	Model有demo和origin两个实例，需要写成类
	存储当前载入模板，绘制海报（不等于显示海报）
	Model类应该是Container类的继承
	严格来说，template实例才是MVC模型中的M,而model实例只是M与V的中间物，更贴近于V
	接口：
		init(template)
			template是以Template类实例的形式保存的海报模板数据。根据template数据初始化model。
		update_bg(bg)
			bg是以BG类实例形式保存的背景数据。
		update_text(text)
			text是ImageText类的实例
		
view:
	显示海报，监听鼠标
	接口：
		show(canvas, model, onmouseclick)
			在canvas上显示model,绑定所有Text实例的点击事件给onmouseclick。
			此处传给onmouseclick的正是control_bar.click_handler
	
control_bar： 
	主控制窗口，在页面右侧。
	
	功能：
		与controller通信，处理初始载入、文字输入改变等事件
		提供不同的界面，实现不同的功能（文字输入、背景选择等)
	接口:
		click_handler(e)
			处理ImageText实例的点击事件。
			e = {model: ... ,text: ... }	//text是model里的Text实例
```

###功能性的类
```
TextLine
    TextLine由DisplayObject继承而来
    TextLine保存一行文字的信息

    Property
        Text    @type string
            文字。
        image   @type Bitmap
            图片格式的文字
        dir     @type integer
            文字方向。0横1竖
        letterSpacing   @type integer
            文字间距。
        fontSize    @type integer
            文字大小。
        fontFamily  @type String
            字体。
        color   @type string
            颜色。

ImageText
    ImageText由Container继承而来。
    ImageText以png形式保存文字。可能包含多行。

    Property
        originText  @type String
            原始字符串。以'\n'表示换行
        reg     @type integer
            参考点(对齐方式）。0左上1右上2右下3左下4居中
        texts   @type array of TextLine
            文字数组。每个元素为一行字母
        dir     @type integer
            文字方向。0横1竖
        letterSpacing   @type integer
            文字间距。
        fontSize    @type integer
            文字大小。
        fontFamily  @type String
            字体。
        color   @type string
            颜色。
        imageLoader  #static   @type function
            类的静态函数。与后台通信的加载器。
			原型
				imageLoader(imageText)
					imageText即ImageText类的实例
			返回
				布尔值。代表是否成功

    Method
		load(string)
			载入string表示的字符串
        
	Event
		textclick
			当text被单击时触发。事件原型同control_bar中click_handler

```
