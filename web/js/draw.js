var g = {};

function drawSetup() {
	g = new GLOW.Context();

	document.body.appendChild(g.domElement);
}

window.addEventListener('resize', function() {
	g.width = window.innerWidth;
	g.height = window.innerHeight;
	g.setupViewport(g);
});

function draw(dt) {

}