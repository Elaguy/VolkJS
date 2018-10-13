/*
	Volk - Basic HTML5 Canvas Raycasting Tech Demo
	
	Written by Elaguy, started on 06/19/18
	
	Source code also avaliable at https://github.com/Elaguy/Volk
	
	Licensed under MIT, avaliable in LICENSE.txt
	
	v0.1.0-prealpha
*/

var App = function() {
	var app = this;
	
	var player = new Player();
	
    app.canvas = document.getElementById("canvas");
    app.ctx = canvas.getContext("2d");
    
    // 24x24 map by default
    app.map = [            
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
	  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
	  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
	
	app.fps = 60; // target fps
	app.dt;
	app.gameStop = false;
	app.gamePaused = false;
	
	app.keys = [];
	
	window.addEventListener("keydown", function (e) { app.keys[e.keyCode] = true; }, false);
	window.addEventListener("keyup", function(e) { app.keys[e.keyCode] = false; }, false);
	
	app.run = function() {
		app.last = (new Date()).getTime();
		
		app.gameInterval = setInterval(app.gameLoop, 1000/app.fps);
	};
	
	app.gameLoop = function() {
		var current = (new Date()).getTime();
		var dt = (current - app.last) / 1000;
		
		app.draw();
		
		if(!app.gameStop || !app.gamePaused)
			app.update(dt);
		
		app.last = current;
	};
	
	app.update = function(dt) {
		app.raycast();
		app.checkInput(dt);
	};
	
	app.draw = function() {
		app.ctx.fillStyle = "black"; 
		app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);
	};

	app.raycast = function() {
		for(var x = 0; x < canvas.width; x++) {
			var camSpaceX = 2 * x / canvas.width - 1;
			var ray = new Ray(camSpaceX, player, app);
			ray.calcVars();
			ray.dda();
			ray.calcDist();
			ray.chooseWallColor();
			ray.draw(app, x);
		}
	};
	
	app.checkInput = function(dt) {
		var moveSpeed = 5 * dt; // squares per second
		var rotSpeed = 3 * dt; // radians per second
		
		if(app.keys[87]) { // move forward
			if(app.map[parseInt(player.posX + player.dirX * moveSpeed)]
			[parseInt(player.posY)] === 0)
				player.posX += player.dirX * moveSpeed;
				
			if(app.map[parseInt(player.posX)]
			[parseInt(player.posY + player.dirY * moveSpeed)] === 0)
				player.posY += player.dirY * moveSpeed;	
		}
		
		if(app.keys[83]) { // move backwards
			if(app.map[parseInt(player.posX - player.dirX * moveSpeed)]
			[parseInt(player.posY)] === 0)
				player.posX -= player.dirX * moveSpeed;
				
			if(app.map[parseInt(player.posX)]
			[parseInt(player.posY - player.dirY * moveSpeed)] === 0)
				player.posY -= player.dirY * moveSpeed;
		}
		
		if(app.keys[68]) { // rotate to the right
			var oldDirX = player.dirX;
			var oldPlaneX = player.planeX;
			
			player.dirX = player.dirX * Math.cos(-rotSpeed) - player.dirY * Math.sin(-rotSpeed);
			player.dirY = oldDirX * Math.sin(-rotSpeed) + player.dirY * Math.cos(-rotSpeed);
			
			player.planeX = player.planeX * Math.cos(-rotSpeed) - 
							player.planeY * Math.sin(-rotSpeed);
			player.planeY = oldPlaneX * Math.sin(-rotSpeed) + 
							player.planeY * Math.cos(-rotSpeed);
		}
		
		if(app.keys[65]) { // rotate to the left
			var oldDirX = player.dirX;
			var oldPlaneX = player.planeX;
			
			player.dirX = player.dirX * Math.cos(rotSpeed) - player.dirY * Math.sin(rotSpeed);
			player.dirY = oldDirX * Math.sin(rotSpeed) + player.dirY * Math.cos(rotSpeed);
			
			player.planeX = player.planeX * Math.cos(rotSpeed) - 
							player.planeY * Math.sin(rotSpeed);
			player.planeY = oldPlaneX * Math.sin(rotSpeed) + 
							player.planeY * Math.cos(rotSpeed);
		}
	};
}

var Player = function() {
	var player = this;
	
	player.posX = 1;
	player.posY = 1;
	player.dirX = 1;
	player.dirY = 0;
	
	player.planeX = 0;
	player.planeY = 0.66;
}

var Ray = function(camSpaceX, player, app) {
	var ray = this;

	ray.rayDirX = player.dirX + player.planeX * camSpaceX;
	ray.rayDirY = player.dirY + player.planeY * camSpaceX;
	
	ray.mapX = player.posX;
	ray.mapY = player.posY;
	
	ray.sideDistX;
	ray.sideDistY;
	
	ray.deltaDistX = Math.abs(1 / ray.rayDirX);
	
	/*
		!! Problem: deltaDistY becomes undefined/infinity/NaN
		when x=320 and camSpaceX=0, since rayDirY=0, and deltaDistY
		becomes 1/0 as a result.
		
		This is most likely causing the hanging/looping problem,
		where ray.mapY becomes NaN.
	*/
	ray.deltaDistY = Math.abs(1 / ray.rayDirY);
	
	ray.perpWallDist;
	ray.lineHeight;
	
	ray.stepX;
	ray.stepY;
	
	ray.hit = false;
	ray.side;
	
	ray.drawStart;
	ray.drawEnd;
	
	ray.wallColor;
	
	ray.calcVars = function() {
		if(ray.rayDirX < 0) {
			ray.stepX = -1;
			ray.sideDistX = (player.posX - ray.mapX) * ray.deltaDistX;
		}
	
		else if(ray.rayDirX > 0) {
			ray.stepX = 1;
			ray.sideDistX = (ray.mapX + 1.0 - player.posX) * ray.deltaDistX;
		}
	
		if(ray.rayDirY < 0) {
			ray.stepY = -1;
			ray.sideDistY = (player.posY - ray.mapY) * ray.deltaDistY;
		}
	
		else if(ray.rayDirY > 0) {
			ray.stepY = 1;
			ray.sideDistY = (ray.mapY + 1.0 - player.posY) * ray.deltaDistY;
		}
	};
	
	// based on the DDA algorithm
	ray.dda = function() {
		
		/*
			!! Bug: when the program gets to half the screen size
			(by default this is x=320), this while loop
			never exits (so apparently a ray is never hiting
			anything), leading the program to hang indefinently.
			
			After some additional research, it seems that ray.mapY
			becomes NaN (Not a Number).
			
			Priority: Critical
		*/
		
		while(!ray.hit) {
		
			/*
				!! After some debugging, it was found that sideDistX
				will always be < sideDistY because sideDistY=Infinity.
				So, normal DDA does not occur and the x=320 ray never hits
				anything.
			*/
			if(ray.sideDistX < ray.sideDistY) {
				ray.sideDistX += ray.deltaDistX;
				ray.mapX += ray.stepX;
				ray.side = 0;
			}
			
			else {
				ray.sideDistY += ray.deltaDistY;
				ray.mapY += ray.stepY;
				ray.side = 1;
			}
		
			if(app.map[ray.mapX][ray.mapY] > 0)
				ray.hit = true;
				
			console.log("mapX = " + ray.mapX + " | " + "mapY = " + ray.mapY);
		}
	};
	
	ray.calcDist = function() {
		if(ray.side === 0)
			ray.perpWallDist = (app.mapX - player.posX + (1 - ray.stepX) / 2) / ray.rayDirX;
		
		else
			ray.perpWallDist = (app.mapY - player.posY + (1 - ray.stepY) / 2) / ray.rayDirY;
			
		ray.lineHeight = canvas.height / ray.perpWallDist;
		
		ray.drawStart = (-ray.lineHeight / 2) + (canvas.height / 2);
		
		if(ray.drawStart < 0)
			ray.drawStart = 0;
			
		ray.drawEnd = (ray.lineHeight / 2) + (canvas.height / 2);
		
		if(ray.drawEnd >= canvas.height)
			ray.drawEnd = canvas.height - 1;
	};
	
	ray.chooseWallColor = function() {
		switch(app.map[ray.mapX][ray.mapY]) {
			// used in ctx.fillStyle
			case 1: ray.wallColor = "red"; break;
			case 2: ray.wallColor = "green"; break;
			case 3: ray.wallColor = "blue"; break;
			case 4: ray.wallColor = "white"; break;
			default: ray.wallColor = "yellow"; break;
		}
	};
	
	ray.draw = function(app, x) {
		app.ctx.fillStyle = ray.wallColor;
		app.ctx.fillRect(x, ray.drawStart, 1, ray.drawEnd);
	};
}

var app = new App();

window.onload = app.run;
