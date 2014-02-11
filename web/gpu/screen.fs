uniform sampler2D diffuse;
uniform sampler2D diffmip;
uniform float exposure;

varying vec2 uv;

void main() {
	vec3 C, D, B, M;

	C = texture2D(diffuse, uv).xyz;
	M = texture2D(diffmip, uv).xyz;

	gl_FragColor = vec4(C, 1.0);
}