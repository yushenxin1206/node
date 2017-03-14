var fs = require('fs');
var index = './views/index.html';
var error = './views/error.html';
var format= 'utf8';

function route(url,res) {
	
	if(url == '/index' || url== "/"){
	
		fs.readFile(index,format,function(err,data){
	
			if(err){
				returnError(res);
			}else{
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(data);
			}
		});
		
	}else{
	
		fs.readFile('./public'+url,format,function(err,data){

			if(err){
				returnError(res);
			}else{
				var i = url.lastIndexOf('.');
				var suffix = url.substr( i+1, url.length);
				res.writeHead(200, {'Content-Type': 'text/'+suffix});
				res.end(data);
			}
		});
		
	};
	
}

function returnError(res){

	fs.readFile(error,format,function(err,data){
		if(err){
			return '404错误';
		}else{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(data);
		}
	});
	
}

module.exports = route;