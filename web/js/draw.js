var g = {};

function drawSetup() {
	g = new GLOW.Context();
	g.setupClear({ red: 0, green: 0, blue: 0 });
	document.body.appendChild(g.domElement);

	// g.enableExtension('GL_OES_standard_derivatives');
	g.enableExtension('OES_standard_derivatives');
	g.enableExtension('OES_texture_float');
	g.enableExtension('OES_texture_float_linear');

	var hw = Math.floor(g.width / 4);
	var hh = Math.floor(g.height / 4);

	g.buffers = {
		diffuse: new GLOW.FBO({ type: GL.FLOAT, filter: GL.NEAREST, depth: false, stencil: false }),
		diffmip: new GLOW.FBO({ type: GL.FLOAT, filter: GL.NEAREST, width: hw, height: hh, depth: false, stencil: false }),
		diffblur: new GLOW.FBO({ type: GL.FLOAT, filter: GL.NEAREST, width: hw, height: hh, depth: false, stencil: false })
	};
	g.bufferScale = {
		diffuse: 1,
		diffmip: 0.25,
		diffblur: 0.25
	};
	g.post = {
		copy: new GLOW.Shader({
			vertexShader: loadFile('./gpu/screen.vs'),
			fragmentShader: loadFile('./gpu/copy.fs'),
			data: {
				map: g.buffers.diffuse,
				vertices: GLOW.Geometry.Plane.vertices(1),
				uvs: GLOW.Geometry.Plane.uvs()
			},
			indices: GLOW.Geometry.Plane.indices(),
			primitives: GLOW.Geometry.Plane.primitives()
		}),
		blur: new GLOW.Shader({
			vertexShader: loadFile('./gpu/screen.vs'),
			fragmentShader: loadFile('./gpu/blur.fs'),
			data: {
				map: g.buffers.diffuse,
				res: new GLOW.Vector2(g.width, g.height),
				pass: new GLOW.Int(0),
				vertices: GLOW.Geometry.Plane.vertices(1),
				uvs: GLOW.Geometry.Plane.uvs()
			},
			indices: GLOW.Geometry.Plane.indices(),
			primitives: GLOW.Geometry.Plane.primitives()
		}),
		result: new GLOW.Shader({
			vertexShader: loadFile('./gpu/screen.vs'),
			fragmentShader: loadFile('./gpu/result.fs'),
			data: {
				diffuse: g.buffers.diffuse,
				diffmip: g.buffers.diffmip,
				diffblur: g.buffers.diffblur,
				exposure: new GLOW.Float(0),
				vertices: GLOW.Geometry.Plane.vertices(1),
				uvs: GLOW.Geometry.Plane.uvs()
			},
			indices: GLOW.Geometry.Plane.indices(),
			primitives: GLOW.Geometry.Plane.primitives()
		})
	};





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

	var lightProxy3 = {
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
	var lps3 = new GLOW.Shader(lightProxy3);

	lps.update = function(dt) {
		var x, y, z, r, a;

		a = (Date.now() % 6000) / 3000 * Math.PI;
		r = 60;

		// x = Math.sin(a) * r;
		// y = 0;
		// z = Math.cos(a) * r;

		x = r;
		y = Math.sin(a) * r * 0.8;
		z = Math.cos(a) * r * 0.8;

		this.transform.setPosition(x, y, z);
	};
	lps2.update = function(dt) {
		var x, y, z, r, a;

		a = (Date.now() % 4000) / 2000 * Math.PI;
		r = 60;

		// x = Math.sin(a) * r;
		// z = 0;
		// y = Math.cos(a) * r;

		x = r;
		y = Math.sin(a) * r * 0.8;
		z = Math.cos(a) * r * 0.8;

		this.transform.setPosition(x, y, z);
	};
	lps3.update = function(dt) {
		var x, y, z, r, a;

		a = (Date.now() % 12000) / 6000 * Math.PI;
		r = 60;

		// z = Math.sin(a) * r;
		// x = 0;
		// y = Math.cos(a) * r;

		x = r;
		y = Math.sin(a) * r * 0.8;
		z = Math.cos(a) * r * 0.8;

		this.transform.setPosition(x, y, z);
	};

	world.space.local.addChild(lps);
	world.space.local.addChild(lps2);
	world.space.local.addChild(lps3);

	// setInterval(function(){lps.update();}, 16);
	// setInterval(function(){lps2.update();}, 16);
	// setInterval(function(){lps3.update();}, 16);







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

			lightPos: new GLOW.Vector3Array([new GLOW.Vector3(), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(100, 100, 100), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3(), new GLOW.Vector3()]),
			lightData: new GLOW.Vector4Array([new GLOW.Vector4(1, 1, 1, 1), new GLOW.Vector4(1, 1, 1, 20), new GLOW.Vector4(1, 1, 1, 10), new GLOW.Vector4(1, 1, 1, 10), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4(), new GLOW.Vector4()]),
			lightInfo: new GLOW.Vector2Array([new GLOW.Vector2(1, 0), new GLOW.Vector2(2, 1), new GLOW.Vector2(2, 1), new GLOW.Vector2(2, 1), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2(), new GLOW.Vector2()]),

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
		var pos3 = lps3.transform.getPosition();
		this.lightPos.value[3] = pos.x;
		this.lightPos.value[4] = pos.y;
		this.lightPos.value[5] = pos.z;
		this.lightPos.value[6] = pos2.x;
		this.lightPos.value[7] = pos2.y;
		this.lightPos.value[8] = pos2.z;
		this.lightPos.value[9] = pos3.x;
		this.lightPos.value[10] = pos3.y;
		this.lightPos.value[11] = pos3.z;
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
	for (var a in g.buffers) {
		g.buffers[a].resize(g.width * g.bufferScale[a], g.height * g.bufferScale[a]);
		g.buffers[a].setupViewport(g.buffers[a]);
	}
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

	g.buffers.diffuse.bind();
	g.buffers.diffuse.clear();

	drawNode(world.space.local);


	g.buffers.diffmip.bind();
	g.buffers.diffmip.clear();

	g.post.copy.map = g.buffers.diffuse;
	g.post.copy.draw();


	g.buffers.diffblur.bind();
	g.buffers.diffblur.clear();

	g.post.blur.map = g.buffers.diffmip;
	g.post.blur.pass = 0;
	g.post.blur.draw();
	g.post.blur.pass = 1;
	g.post.blur.draw();


	g.buffers.diffblur.unbind();
	g.clear();
	g.post.result.diffuse = g.buffers.diffuse;
	g.post.result.diffmip = g.buffers.diffmip;
	g.post.result.diffblur = g.buffers.diffblur;
	g.post.result.draw();

	// drawNode(world.space.local);
	// g.post.result.draw();

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