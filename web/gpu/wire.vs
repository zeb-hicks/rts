uniform mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;
attribute vec3 normals;
attribute vec2 uvs;
attribute vec3 bary;

varying vec3 normal;
varying vec2 uv;
varying vec3 bc;

void main() {
	uv = uvs;
	normal = normalize(mat3(transform[0].xyz, transform[1].xyz, transform[2].xyz) * normals);
	bc = bary;
	gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices, 1.0);
}