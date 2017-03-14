//sever.js
var http = require('http');
var fs = require('fs');
var route = require('./routes/route');

http.createServer( function(req, res) {
	
	var data=route(req.url);

	
	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	res.writeHead(200, {'Content-Type': 'text/plain'});

	// 发送响应数据 "Hello World"
	res.end(data);
	
}).listen(3000);

console.log("server已启动...");