var g = {};

function drawSetup() {
	g = new GLOW.Context();
	g.setupClear({ red: 0, green: 0, blue: 0 });
	document.body.appendChild(g.domElement);

	g.enableExtension('OES_standard_derivatives');

	var cube = {
		vertexShader: loadFile('./gpu/wire.vs'),
		fragmentShader: loadFile('./gpu/wire.fs'),
		data: {
			transform: new GLOW.Matrix4(),
			cameraInverse: GLOW.defaultCamera.inverse,
			cameraProjection: GLOW.defaultCamera.projection,

			tDiffuse: new GLOW.Texture({url: './img/world/grass/clover_big_diffuse.jpg'}),
			tNormal: new GLOW.Texture({url: './img/world/grass/clover_big_normal.jpg'}),
			tSpecular: new GLOW.Texture({url: './img/world/grass/clover_big_spec.jpg'}),
			tAO: new GLOW.Texture({url: './img/world/grass/clover_big_ao.jpg'}),

			vertices: GLOW.Geometry.Cube.vertices(100),
			bary: GLOW.Geometry.Cube.bary(),
			uvs: GLOW.Geometry.Cube.uvs()
		},
		indices: GLOW.Geometry.Cube.indices(),
		primitives: GLOW.Geometry.Cube.primitives()
	};

	cube.data.normals = GLOW.Geometry.Cube.normals(cube.data.vertices, cube.indices);

	var shader = new GLOW.Shader(cube);

	shader.update = function(dt) {
		// console.log(dt);
		dt = dt || 0;
		this.transform.addRotation(dt * 0.1, dt * 0.5, dt * 0.3);
	};

	world.space.local.addChild(shader);

	GLOW.defaultCamera.localMatrix.setPosition(0, 0, 500);
	GLOW.defaultCamera.update();
}

window.addEventListener('resize', function() {
	g.width = window.innerWidth;
	g.height = window.innerHeight;
	GLOW.defaultCamera.projection.copy(GLOW.Matrix4.makeProjection(GLOW.defaultCamera.fov, g.width / g.height, GLOW.defaultCamera.near, GLOW.defaultCamera.far))
	GLOW.defaultCamera.aspect = g.width / g.height;
	g.resize(g.width, g.height);
	g.setupViewport(g);
});

function draw(dt) {

	g.cache.clear();
	g.clear();

	drawNode(world.space.local);

}

function drawNode(node) {
	if (node.children !== undefined && node.children.length > 0) {
		for (var i = 0; i < node.children.length; i++) {
			drawNode(node.children[i]);
		}
	}
	if (node.draw !== undefined) {
		node.draw();
	}
}