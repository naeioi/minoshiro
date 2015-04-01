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
			向服务器请求text并返回一个Texts类的实例
		onload(e), onprogress(e), oncomplete(e)
			监听载入事件并提示进度。事件是createjs的Event类的实例
		
model:
	model有demo和origin两个实例，需要写成类
	存储当前载入模板，绘制海报（不等于显示海报）
	接口：
		init(template)
			template是以Template类实例的形式保存的海报模板数据。根据template数据初始化model。
		
		
view:
	显示海报，监听鼠标
	
control_bar： 
	主控制窗口，在页面右侧。
	
	接口：
		与controller通信，处理初始载入、文字输入改变等事件
		提供不同的界面，实现不同的功能（文字输入、背景选择等)
	
```
