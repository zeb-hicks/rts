const int LIGHT_COUNT = 8; // Need to inject this depending on GPU caps, rather than hard coded.

uniform mat4 transform;
uniform mat4 transformInverse;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;
uniform vec3 cameraPosition;
uniform vec3 lightPos[LIGHT_COUNT]; // X Y Z

attribute vec3 vertices;
attribute vec3 normals;
attribute vec4 tangents;
attribute vec2 uvs;
attribute vec3 bary;

varying vec3 worldpos;
varying vec3 eyepos;
varying vec3 normal;
varying vec3 tangent;
varying vec3 binormal;
varying vec2 uv;
varying vec3 bc;

varying mat3 TBN;
// varying vec3 tsLightPos[LIGHT_COUNT];
varying vec3 tsEyePos;
varying vec3 tsWorldPos;

void main() {
	uv = uvs;

	// normal = normalize(mat3(transform[0].xyz, transform[1].xyz, transform[2].xyz) * normals);
	normal = normalize(normals);
	tangent = normalize(tangents.xyz);
	// if (length(tangent) == 0.0) tangent = vec3(1.0, 0.0, 0.0);
	binormal = normalize(cross(normal, tangent) * tangents.w);

	// normal = (vec4(normal, 1.0) * transform * cameraInverse * cameraProjection).xyz;
	// tangent = (vec4(tangent, 1.0) * transform * cameraInverse * cameraProjection).xyz;
	// binormal = (vec4(binormal, 1.0) * transform * cameraInverse * cameraProjection).xyz;

	TBN = mat3(tangent, binormal, normal);

	bc = bary;
	worldpos = vertices;
	// vec4 wpos = vec4(vertices, 1.0) * transform * cameraInverse * cameraProjection;
	eyepos = cameraPosition * mat3(transform[0].xyz, transform[1].xyz, transform[2].xyz);

	tsEyePos = eyepos * TBN;
	tsWorldPos = worldpos * TBN;

	gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices, 1.0);
}