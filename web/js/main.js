window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

function importAll() {
	var list = [];
	for (var i = 0; i < arguments.length; i++) list.push(arguments[i]);
	var callback = list.pop();
	loadNext(list, function() {
		callback();
	});
}

function loadNext(list, cb) {
	var scr = document.createElement('script');
	scr.loadList = list;
	scr.callback = cb;
	scr.src = './js/' + list.shift();
	scr.addEventListener('load', function() {
		if (this.loadList.length > 0) {
			loadNext(this.loadList, this.callback);
		} else {
			this.callback();
		}
	});
	document.head.appendChild(scr);
}

// Synchronous XHR function. Will have to refactor to be async later on. For now this simplifies some things.
function loadFile(f) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', f, false);
	xhr.setRequestHeader('Cache-Control','no-cache,max-age=0');
	xhr.setRequestHeader('Pragma','no-cache');
	xhr.send(null);
	return xhr.responseText;
}

importAll('lib/glowcore.js', 'lib/glowexts.js', 'loop.js', 'draw.js', 'world.js', 'planet.js', 'game.js', init);

function init() {
	// Game Setup
	gameSetup();
	// World Setup
	worldSetup();
	// GL Setup
	drawSetup();
	// Start game loop.
	requestAnimationFrame(loop);
}