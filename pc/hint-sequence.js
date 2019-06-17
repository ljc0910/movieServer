var enjoyhint_instance = new EnjoyHint({});

var enjoyhint_script_steps = [
  {
  	'next #video-list' : '欢迎来到jc电影！让我来引导你了解它的特点。',
  	'nextButton' : {className: "myNext", text: "可以"},
  	'skipButton' : {className: "mySkip", text: "不了!"}
  },
  {
	  'next input' : "请输入关键词",
	  'nextButton' : {className: "myNext", text: "好了"},
  },
  {
  	'click .btn' : '点击这个按钮，进行检索'
  },
  {
	  'next #video-list' : '这里是搜索结果,滚动鼠标滑轮可下滑哦',
  },
  {
	  'next .qqme' : '使用中如有问题请联系我',
	  'showSkip' : false,
	  'nextButton' : {className: "myNext", text: "知道了!"}
  }

];

enjoyhint_instance.set(enjoyhint_script_steps);
// enjoyhint_instance.run(); 