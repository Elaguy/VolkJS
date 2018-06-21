/*
	Volk - Basic HTML5 Canvas Raycasting Tech Demo
	
	Written by Elaguy, started on 06/19/18
	
	Source code also avaliable at https://github.com/Elaguy/VolkJS
	
	v0.0.0-prealpha
*/

var App = function() {
	var app = this;
	
    app.canvas = document.getElementById("canvas");
    app.ctx = canvas.getContext("2d");
	
	app.fps = 30; // target fps
	app.gameStop = false;
	app.gamePaused = false;
	
	app.keys = [];
	
	app.run = function() {
		app.last = (new Date()).getTime();
		
		app.gameInterval = setInterval(app.gameLoop, 1000/app.fps);
	};
	
	app.gameLoop = function() {
		var current = (new Date()).getTime();
		var dt = (current - app.last) / 1000;
		
		if(!app.gameStop && !app.gamePaused)
			app.update(dt);
		
		app.draw(dt);
		
		app.last = current;
	};
	
	app.update = function() {

	};
	
	app.draw = function() {
		app.ctx.fillStyle = "black";
		app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);
	};
}

var app = new App();

window.onload = app.run;
