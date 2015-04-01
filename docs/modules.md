#前端模块
-------------	
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
		load_text(text)
			向服务器请求text并返回一个Texts类的实例。注意text也是一个Text实例，只有文字数据没有图片数据。
		onload(e), onprogress(e), oncomplete(e)
			监听载入事件并提示进度。事件是createjs的Event类的实例
		output_origin()
			渲染origin并自动下载

model:
	Model有demo和origin两个实例，需要写成类
	存储当前载入模板，绘制海报（不等于显示海报）
	Model类应该是Container类的继承
	接口：
		init(template)
			template是以Template类实例的形式保存的海报模板数据。根据template数据初始化model。
		update_bg(bg)
			bg是以BG类实例形式保存的背景数据。
		update_text(text)
			text是Text类的实例
		
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
			处理Text实例的点击事件。
			e = {model: ... ,text: ... }	//text是model里的Text实例
```
