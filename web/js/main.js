window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

// Basic javascript imports.
// Should probably use something more sophisticated but this will do for now.

var importlist = {};
function imports(js) {
	var scr = document.createElement('script');
	scr.src = './js/' + js;
	importlist[js] = false;
	scr.addEventListener('load', function() {
		importlist[js] = true;
	});
	document.head.appendChild(scr);
}

// Brute force import load checking.
var icheck = setInterval(function() {
	var ii = 0;
	var ic = 0;
	for (var a in importlist) {
		ii++;
		if (importlist[a]) {
			delete importlist[a] == true;
			ic++;
		}
	}
	if (ic > 0 && ic == ii) {
		clearInterval(icheck);
		init();
	}
}, 100);

// Synchronous XHR function. Will have to refactor to be async later on. For now this simplifies some things.
function loadFile(f) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', f, false);
	xhr.send(null);
	return xhr.responseText;
}

imports('lib/glowcore.js');
imports('lib/glowexts.js');

imports('loop.js');
imports('draw.js');

imports('world.js');
imports('planet.js');
imports('game.js');

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