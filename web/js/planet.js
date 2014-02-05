function Planet(o) {
	o = o || {};
	GLOW.Node.call(this);

	this.name = o.name || 'Planet';

	this.radius = o.radius || 250;
	this.atmosphereDepth = o.atmosphereDepth || o.radius / 10 || 16;

	this.detail = 4; // Subdivisions on chunk faces.

	var i = 0;
	this.sides = [
		new PlanetChunk(this, i++),
		new PlanetChunk(this, i++),
		new PlanetChunk(this, i++),
		new PlanetChunk(this, i++),
		new PlanetChunk(this, i++),
		new PlanetChunk(this, i++)
	];

	this.shader = {
		transform: new GLOW.Matrix4(),
		cameraInverse: GLOW.defaultCamera.inverse,
		cameraProjection: GLOW.defaultCamera.projection,

		tDiffuse: new GLOW.Texture({url: './img/world/grass/clover_big_diffuse.jpg'}),
		tNormal: new GLOW.Texture({url: './img/world/grass/clover_big_normal.jpg'}),
		tSpecular: new GLOW.Texture({url: './img/world/grass/clover_big_spec.jpg'}),
		tAO: new GLOW.Texture({url: './img/world/grass/clover_big_ao.jpg'}),
	};

	// TODO:
	// Generate heightmaps

	// Generate meshes

	// Generate any other data we may need in advance
}
Planet.prototype = Object.create(GLOW.Node.prototype);

// Calculate point on planet surface from cube coordinates.
// function PlanetPoint(planet, side, depth, x, y) {
// 	x += 0.5;
// 	y += 0.5;
// 	var fuv = 2 / planet.detail;
// 	var cuv = 2 / Math.pow(2, depth);
// 	var cx = -1 + 2 * x * cuv;
// 	var cy = -1 + 2 * y * cuv;
// 	var vuv = cuv * fuv;
// 	switch (side) {
// 		case 0: // X-up
// 			return new GLOW.Vector3(1, cx, cy).normalize().multiplyScalar(planet.radius);
// 			break;
// 		case 1: // X-down
// 			return new GLOW.Vector3(-1, cx, cy).normalize().multiplyScalar(planet.radius);
// 			break;
// 		case 2: // Y-up
// 			return new GLOW.Vector3(cx, -1, cy).normalize().multiplyScalar(planet.radius);
// 			break;
// 		case 3: // Y-down
// 			return new GLOW.Vector3(cx, 1, cy).normalize().multiplyScalar(planet.radius);
// 			break;
// 		case 4: // Z-up
// 			return new GLOW.Vector3(cx, cy, 1).normalize().multiplyScalar(planet.radius);
// 			break;
// 		case 5: // Z-down
// 			return new GLOW.Vector3(cx, cy, -1).normalize().multiplyScalar(planet.radius);
// 			break;
// 		default:
// 			return new GLOW.Vector3(cx, cy, 1).normalize().multiplyScalar(planet.radius);
// 	}
// }

function PlanetChunk(planet, side, level, u, v) {
	// Generate planet chunk.
	var vstride = Math.pow(planet.detail + 1, 2);
	var fstride = Math.pow(planet.detail, 2);
	this.vertices = new Float32Array(vstride * 3); // Vertex Values
	this.normals = new Float32Array(vstride * 3); // Vertex Normals
	this.indices = new Uint16Array(fstride * 6); // Triangle Vertex Indices
	this.uvs = new Float32Array(vstride * 2); // Vertex UVs
	this.primitives = GL.TRIANGLES; // Primitive type.

	this.level = level > 0 ? level : 1;

	var i, j, k, x, y;
	var d, s, t;

	d = 1 / (this.level * planet.detail); // Distance between vertices in surface units.

	for (y = 0; y < vstride; y++) {
		for (x = 0; x < vstride; x++) {
			i = x + y * vstride * 3;
			s = d * (u + x);
			// k = Math.sqrt(3 + 4 * ());
			this.vertices[i + 0] = 0;
		}
	}
}