var pt = performance.now();
var dt = 0;
var frame = 0;

function loop() {
	requestAnimationFrame(loop);
	dt = performance.now() - pt;
	pt += dt;

	world.update(dt);

	draw(dt);
	frame++;
}