uniform mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;

void main() {
	gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices, 1.0);
}