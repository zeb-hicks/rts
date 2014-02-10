var g = {};

function drawSetup() {
	g = new GLOW.Context();
	g.setupClear({ red: 0, green: 0, blue: 0 });
	document.body.appendChild(g.domElement);

	g.enableExtension('GL_OES_standard_derivatives');
	g.enableExtension('OES_standard_derivatives');

	var lightProxy = {
		vertexShader: loadFile('./gpu/white.vs'),
		fragmentShader: loadFile('./gpu/white.fs'),
		data: {
			transform: new GLOW.Matrix4(),
			cameraInverse: GLOW.defaultCamera.inverse,
			cameraProjection: GLOW.defaultCamera.projection,
			vertices: GLOW.Geometry.Sphere.vertices(1, 16)
		},
		indices: GLOW.Geometry.Sphere.indices(16),
		primitives: GLOW.Geometry.Sphere.primitives()
	};

	var lightProxy2 = {
		vertexShader: loadFile('./gpu/white.vs'),
		fragmentShader: loadFile('./gpu/white.fs'),
		data: {
			transform: new GLOW.Matrix4(),
			cameraInverse: GLOW.defaultCamera.inverse,
			cameraProjection: GLOW.defaultCamera.projection,
			vertices: GLOW.Geometry.Sphere.vertices(1, 16)
		},
		indices: GLOW.Geometry.Sphere.indices(16),
		primitives: GLOW.Geometry.Sphere.primitives()
	};

	var lps = new GLOW.Shader(lightProxy);
	var lps2 = new GLOW.Shader(lightProxy2);

	lps.update = function(dt) {
		var x, y, z, r, a;

		a = (Date.now() % 4000) / 2000 * Math.PI;
		r = 100;

		x = Math.sin(a) * r;
		y = 0;
		z = Math.cos(a) * r;

		this.transform.setPosition(x, y, z);
	};
	lps2.update = function(dt) {
		var x, y, z, r, a;

		a = (Date.now() % 8000) / 4000 * Math.PI;
		r = 100;

		x = Math.sin(a) * r;
		z = 0;
		y = Math.cos(a) * r;

		this.transform.setPosition(x, y, z);
	};

	world.space.local.addChild(lps);
	world.space.local.addChild(lps2);

	// var tex = 'test/test';
	// var tex = 'grass/clover_big';
	var tex = 'rock/stone';
	// var tex = 'struct/square_tiles';
	// var tex = 'dirt/dirt_stones';

	var cube = {
		vertexShader: loadFile('./gpu/wire.vs'),
		fragmentShader: loadFile('./gpu/wire.fs'),
		data: {
			transform: new GLOW.Matrix4(),
			transformInverse: new GLOW.Matrix4(),
			cameraInverse: GLOW.defaultCamera.inverse,
			cameraProjection: GLOW.defaultCamera.projection,
			cameraPosition: GLOW.defaultCamera.position,

			lightPos: new GLOW.Vector3Array([new GLOW.Vector3(), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3()]),
			lightData: new GLOW.Vector4Array([new GLOW.Vector4(1.0, 1.0, 1.0, 5), new GLOW.Vector4(1.0, 0.0, 0.0, 100), new GLOW.Vector4(0.0, 1.0, 1.0, 100), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4()]),
			lightInfo: new GLOW.Vector2Array([new GLOW.Vector2(1, 0), new GLOW.Vector2(2, 1), new GLOW.Vector2(2, 1), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2()]),
			// lightPos: new GLOW.Vector3Array([new GLOW.Vector3(), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3()]),
			// lightData: new GLOW.Vector4Array([new GLOW.Vector4(1.0, 1.0, 1.0, 5), new GLOW.Vector4(1.0, 1.0, 1.0, 100), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4()]),
			// lightInfo: new GLOW.Vector2Array([new GLOW.Vector2(1, 0), new GLOW.Vector2(2, 1), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2()]),

			parallaxAmount: new GLOW.Float(0.075),

			// tDiffuse: new GLOW.Texture({url: './img/world/' + tex + '_height.jpg'}),
			tDiffuse: new GLOW.Texture({url: './img/world/' + tex + '_diffuse.jpg'}),
			tNormal: new GLOW.Texture({url: './img/world/' + tex + '_normal.jpg'}),
			tSpecular: new GLOW.Texture({url: './img/world/' + tex + '_spec.jpg'}),
			tHeight: new GLOW.Texture({url: './img/world/' + tex + '_height.jpg'}),
			tAO: new GLOW.Texture({url: './img/world/' + tex + '_ao.jpg'}),

			vertices: GLOW.Geometry.Cube.vertices(100),
			bary: GLOW.Geometry.Cube.bary(),
			uvs: GLOW.Geometry.Cube.uvs(),
		},
		indices: GLOW.Geometry.Cube.indices(),
		primitives: GLOW.Geometry.Cube.primitives()
	};

	cube.data.normals = GLOW.Geometry.Cube.normals(cube.data.vertices, cube.indices);
	cube.data.tangents = GLOW.Geometry.faceTangents(cube.data.vertices, cube.indices, cube.data.normals, cube.data.uvs);

	var shader = new GLOW.Shader(cube);

	shader.update = function(dt) {
		var pos = lps.transform.getPosition();
		var pos2 = lps2.transform.getPosition();
		this.lightPos.value[3] = pos.x;
		this.lightPos.value[4] = pos.y;
		this.lightPos.value[5] = pos.z;
		this.lightPos.value[6] = pos2.x;
		this.lightPos.value[7] = pos2.y;
		this.lightPos.value[8] = pos2.z;
		// this.transform.setRotation(my * 3, mx * 3, 0);
		// this.transform.addRotation(dt * 0.1, dt * 0.5, dt * 0.3);
		// var x, y, z, r, a;
		// a = (Date.now() % 20000) / 10000 * Math.PI;
		// r = 100;
		// x = Math.cos(a) * r;
		// z = Math.sin(a) * r;
		// y = 0;
		// this.lightPos.value[3] = x;
		// this.lightPos.value[4] = y;
		// this.lightPos.value[5] = z;
		// GLOW.Matrix4.makeInverse(this.transform, this.transformInverse);
	};

	world.space.local.addChild(shader);

	GLOW.defaultCamera.localMatrix.setPosition(0, 0, 250);
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

var mx = 0, my = 0;
window.addEventListener('mousemove', function(e) {
	mx = e.clientX / window.innerWidth * 2 - 1;
	my = e.clientY / window.innerHeight * 2 - 1;
});

function draw(dt) {

	g.cache.clear();
	g.clear();

	var x, y, z, r, a1, a2;
	a = (Date.now() % 40000) / 20000 * Math.PI;

	// a = mx * Math.PI;
	a1 = mx * Math.PI;
	a2 = my * Math.PI / 2;

	r = 300;
	x = Math.cos(a1) * r * Math.cos(a2);
	z = Math.sin(a1) * r * Math.cos(a2);
	y = Math.sin(a2) * r;
	GLOW.defaultCamera.target.set(0, 0, 0);
	GLOW.defaultCamera.localMatrix.setPosition(x, y, z);
	GLOW.defaultCamera.position.set(x, y, z);
	GLOW.defaultCamera.update();
	// GLOW.defaultCamera.localMatrix.makeInverse(this.transform, this.transformInverse);

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