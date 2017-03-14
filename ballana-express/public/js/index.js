$(function(){

	var canvas=document.getElementById("myCanvas");
	var ctx=canvas.getContext("2d");
	
	canvas.height=$(window).height();
	canvas.width=$(window).width();
	window.onresize=resize();
	
	var balls=[];
	var timer={};
	var over=0;
	var count=0;
	var reTimer=0;
	
	var center={
		x: Math.round(0.5*canvas.width),
		y: Math.round(0.5*canvas.height)
	}
	var player={
			x: center.x,
			y: center.y,
			color: 'black',
			r: 20
		};
	var range={
			x: center.x,
			y: center.y,
			color: 'rgba(200,200,200,.2)',
			r: 100
		}
	
	/*函数防抖*/
	function resize(){
	
		var timer;
		
		return function(){
		
			clearTimeout(timer);
			
			timer=setTimeout(function(){
			
				canvas.height=$(window).height();
				canvas.width=$(window).width();
				center={
					x: Math.round(0.5*canvas.width),
					y: Math.round(0.5*canvas.height)
				}
				
			},100);
		} 
	}
	
	function random(m,n){
		return Math.floor(Math.random()*(n-m)+m);
	}
	
	/*小球类*/
	function ball(r,speed){
		this.r=r;
		this.position={side:random(1,5),point:random(0,100)};
		this.speed={};
		var rate=Math.random()*(0.8-0.2)+0.2;
		this.speed.x=Math.round(rate*speed);
		this.speed.y=Math.round(Math.pow((1-Math.pow(rate,2)),0.5)*speed);
		this.color="rgba("+random(0,200)+","+random(0,200)+","+random(0,200)+",1)";
	}
	
	/*生成难度和小球*/
	function level(r,speed,num){
		balls=[];
		for(var i=0;i<num;i++){
			balls[i]=new ball(r,speed);
		}
		//console.log(balls);
	}
	
	/*绘制*/
	function draw(ball){
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = ball.color;
        ctx.fill();
	}
	/*绘制开始位置*/
	function drawBegin(ball){
		var x,y;
		var left=Math.round(canvas.width/100*ball.position.point);
		var top=Math.round(canvas.height/100*ball.position.point);
		switch(ball.position.side){
			case 1: x=left; y=0; ball.speed.y=-ball.speed.y; break;
			case 2: x=canvas.width; y=top; break;
			case 3: x=left; y=canvas.height; break;
			case 4: x=0; y=top; ball.speed.x=-ball.speed.x; break;
			default: break;
		}
		
		ball.x=x;
		ball.y=y;
		
		draw(ball);
	}
	
	/*动画*/
	function animation(){
		
		timer=setInterval(function(){
		
			ctx.clearRect(0,0,canvas.width,canvas.height); 
			draw(range);//绘制玩家活动范围
			
			//绘制小球
			for(i=0;i<balls.length;i++){
				calcPoint(balls[i]);
				draw(balls[i]);
			}
			
			draw(player);//绘制玩家
			
			//碰撞检测
			if(knockDet()){
				
				pause();
				gameOver();
		
			}
			
		},20);
		
	}
	
	/*计算墙壁碰撞*/
	function calcPoint(ball){
	
		if(ball.x >= canvas.width || ball.x <= 0){
		
			ball.speed.x=-ball.speed.x;
			
		}
		if(ball.y >= canvas.height || ball.y <= 0){
			
			ball.speed.y=-ball.speed.y;
			
		}
		
		ball.x=ball.x+ball.speed.x;
		ball.y=ball.y+ball.speed.y;
	}
	
	/*开始*/
	function start(r,speed,num){
		
		//设置难度
		level(r,speed,num);
		//玩家归位
		player.x=center.x;
		player.y=center.y;
		ctx.clearRect(0,0,canvas.width,canvas.height); 
		
		draw(player);//绘制玩家
		draw(range);//绘制玩家活动范围
		
		for(var i=0;i<balls.length;i++){
			drawBegin(balls[i]);
		}
		
		countDown().then(animation);
	
	}
	
	/*玩家控制*/
	$("body").keydown(function(){
	
		var keyCode=event.keyCode;
		
		//console.log(keyCode);
		
		switch(keyCode){
			case 32: pause(); break;
			case 37: move(-1,0); break;
			case 38: move(0,-1); break;
			case 39: move(1,0); break;
			case 40: move(0,1); break;
			default: break;
		}
	});	
	
	/*玩家移动*/
	function move(x,y){
		if(timer){
			player.x=player.x+x*30;
			player.y=player.y+y*30;
			//判断是否在范围内 不在则取消移动
			if(Math.pow(player.x-center.x,2)+Math.pow(player.y-center.y,2)>Math.pow(range.r,2)){
				player.x=player.x-x*30;
				player.y=player.y-y*30;
			}		
		}
	}
	/*开始暂停*/
	function pause(){
		if(!count){
			if(over){
				clearInterval(reTimer);
				reTimer=0;
				start(15,20,10);
				over=0;
			}else if(timer){
				clearInterval(timer);
				timer=0;
			}else{
				animation();
			}	
		}
		
	}
	
	/*game over*/
	function gameOver(){
		ctx.fillStyle = "#58a";
		ctx.font = "80px Courier New,Consola,SimSun";
		ctx.fillText("GAME OVER", center.x-220, center.y);
		over=1;
		
		ctx.fillStyle = "#666";
		ctx.font = "30px arial";
		ctx.fillText("按空格键重新开始", center.x-120, center.y+300);
		
		reTimer=setInterval(function(){
			ctx.clearRect(center.x-120,center.y+250,300,100);
			setTimeout(function(){
				ctx.clearRect(center.x-120,center.y+250,300,100);
				ctx.fillStyle = "#666";
				ctx.font = "30px arial";
				ctx.fillText("按空格键重新开始", center.x-120, center.y+300);
			},200);
		},1000);
	}
	/*count down*/
	function countDown(){
		count=1;
		var dtd = $.Deferred();
		var timeDown=3;
		var timerD=setInterval(function(){
			
			if(timeDown>0){
				ctx.clearRect(center.x-130,center.y-300,300,120); 
				ctx.fillStyle = "#58a";
				ctx.font = "80px Courier New,Consola,SimSun";
				ctx.fillText(timeDown, center.x-30, center.y-200);
				timeDown--;
			}else{
				clearInterval(timerD);
				count=0;
				dtd.resolve();
			}
			
		},1000);
		
		return dtd;
	}
	
	/*碰撞检测*/
	function knockDet(){
		for(var i=0;i<balls.length;i++){
			if(Math.pow(player.x-balls[i].x,2)+Math.pow(player.y-balls[i].y,2)<Math.pow(balls[i].r+player.r,2)){
				return 1;
			}
		}
		
		return 0;
	}
	
	start(15,20,10);
	//console.log(balls);
	
});