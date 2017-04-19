function BallBox( canvas ){
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.imgData = null;
	// 文字的像素点
	this.printPixels = [];
	//文字像素点的个数
	this.count = 0;
	// 球对象数组
	this.balls =[];
	// 图片像素点半径距离
	this.r = 3;
	// 中心
	this.vpx = undefined;
	this.vpy = undefined;
	// 图片像素点偏移量
	this.offsetX = 95;
	this.offsetY = 110;
	// 球的半径
	this.ballR = 2;
}

BallBox.prototype = {
	//设置三维中心
	setBasePoint: function(x, y){
		this.vpx = x;
		this.vpy = y;
	},
	// 获取文字像素点
	initText: function(){
		this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.imgData.width; i++) {
			for (var j = 0; j < this.imgData.height; j++) {
				if(this.getPixel(i, j)[3] > 0){
					this.printPixels.push([i, j]);
					this.count++;
				}
			}
		}
	},

	// 获取图片文字像素点
	initImg: function(id){
		var img = document.getElementById(id);
		this.ctx.drawImage(img, 0, 0);
		this.imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.imgData.width; i++) {
			for (var j = 0; j < this.imgData.height; j++) {
				if(this.getPixel(i, j)[3] > 0){
					this.printPixels.push([this.offsetX + i * this.r * 2, this.offsetY + j * this.r * 2])
				}
			}
		}
		for (var i = 0; i < this.printPixels.length; i++) {
			this.createBall(this.printPixels[i][0], this.printPixels[i][1], 0, this.ballR);
		}
		console.log(this.printPixels.length);
	},

	// 获得像素点的rgba
	getPixel: function(x, y){
		var index = (x + y * this.canvas.width) * 4;
		var r = this.imgData.data[index + 0];
		var g = this.imgData.data[index + 1];
		var b = this.imgData.data[index + 2];
		var a = this.imgData.data[index + 3];
		return [r, g, b, a];
	},

	createText: function(font, color, text, x, y){
		this.ctx.font = font;
		this.ctx.fillStyle = color;
		this.ctx.fillText(text, x, y);
	},

	createBall: function(x, y, z, ballR){
		this.balls.push(new Ball(this, x, y, z, ballR));
	},

	render: function(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].update();
			this.balls[i].draw();
		}
	}
}

function Ball(ballBox, x, y, z, ballR){
	this.ballBox = ballBox;

	// 球的位置
	this.x = Math.random() * 1000 - 500;
    this.y = Math.random() * 1000 - 500;
    this.z = Math.random() * 1000 - 500;
	
	// 球的目标位置（文字
	this.tx = x === undefined? Math.random() * 200 - 100: x;
	this.ty = y === undefined? Math.random() * 200 - 100: y;
	this.tz = z === undefined? Math.random() * 200 - 100: z;
	
	this.addX = (this.tx - this.x) / 200;
	this.addY = (this.ty - this.y) / 200;
	this.addZ = (this.tz - this.z) / 200;
	this.index = 0;

	// 球的颜色
	this.r = Math.floor(Math.random() * 255);
    this.g = Math.floor(Math.random() * 255);
    this.b = Math.floor(Math.random() * 255);
    this.color = 'rgba('+this.r+','+this.g+','+this.b+',1)';

    // 二维上半径
    this.radius = ballR;

    // 三维上半径
    this.ballR = ballR === undefined? 10 + Math.random() * 10: ballR;

    //二维上坐标
    this.x2 = x;
    this.y2 = y;
}

Ball.prototype = {
	update: function(){
		// 焦距，一般设为一个常量
		var focalLength = 200;

		// 把z方向扁平化
		var scale = focalLength / (focalLength + this.z);
		this.x2 = this.ballBox.vpx + this.x * scale;
		this.y2 = this.ballBox.vpy + this.y * scale;
		this.radius = this.ballR * scale;

		if(this.radius < 0)
			this.radius = undefined;
		
		if(this.index >= 200 && this.index <= 250){
			this.index++;
			return;
		}

		this.x += this.addX;
		this.y += this.addY;
		this.z += this.addZ;
		this.index++;
	},
	draw: function(){
		this.ballBox.ctx.beginPath();
		this.ballBox.ctx.fillStyle = this.color;
		this.ballBox.ctx.arc(this.x2, this.y2, this.radius, 0, Math.PI*2, true);
		this.ballBox.ctx.fill();
	}
}