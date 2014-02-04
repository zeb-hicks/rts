function Planet(o) {
	o = o || {};
	GLOW.Node.call(this);

	this.name = o.name || 'Planet';

	this.radius = o.radius || 250;
	this.atmosphereDepth = o.atmosphereDepth || o.radius / 10 || 16;

	// TODO:
	// Generate heightmaps

	// Generate meshes

	// Generate any other data we may need in advance
}
Planet.prototype = Object.create(THREE.Object3D.prototype);

// Calculate point on planet surface from cube coordinates.
function PlanetPoint(radius, detail, side, depth, x, y) {
	x += 0.5;
	y += 0.5;
	var fuv = 2 / detail;
	var cuv = 2 / Math.pow(2, depth);
	var cx = -1 + 2 * x * cuv;
	var cy = -1 + 2 * y * cuv;
	var vuv = cuv * fuv;
	switch (side) {
		case 0: // X-up
			return new GLOW.Vector3(1, cx, cy).normalize().multiplyScalar(radius);
			break;
		case 1: // X-down
			return new GLOW.Vector3(-1, cx, cy).normalize().multiplyScalar(radius);
			break;
		case 2: // Y-up
			return new GLOW.Vector3(cx, -1, cy).normalize().multiplyScalar(radius);
			break;
		case 3: // Y-down
			return new GLOW.Vector3(cx, 1, cy).normalize().multiplyScalar(radius);
			break;
		case 4: // Z-up
			return new GLOW.Vector3(cx, cy, 1).normalize().multiplyScalar(radius);
			break;
		case 5: // Z-down
			return new GLOW.Vector3(cx, cy, -1).normalize().multiplyScalar(radius);
			break;
		default:
			return new GLOW.Vector3(cx, cy, 1).normalize().multiplyScalar(radius);
	}
}

function PlanetChunk(radius, detail, side, depth, x, y) {
	// Generate planet chunk.
}