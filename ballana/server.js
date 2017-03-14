//sever.js
var http = require('http');
var fs = require('fs');
var route = require('./routes/route');

http.createServer( function(req, res) {

	route(req.url,res);
	
}).listen(3000);

console.log("server已启动...");