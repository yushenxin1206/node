var fs=require("fs");
var express=require("express");
var app=express();
var _dirname='./views/';

/*设置静态资源 静态资源不受路由控制*/
app.use(express.static('public'));

/*路由*/ /*use只匹配前缀 含有就行 all匹配所有，要一样才行*/
app.get('/', function (req, res, next) {

	fs.readFile(_dirname+'index.html','utf8',function(err,data){
		if(err){
			res.send('洗再不好意西，找不到该文件 /(ㄒoㄒ)/~~');
		}else{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(data);
		}
	});
	
});

app.use(function (req, res, next) {
	res.send('洗再不好意西，找不到该文件 /(ㄒoㄒ)/~~');
});

/*建立服务器*/
var server = app.listen(3000, function () {

  console.log("server已启动...");

})