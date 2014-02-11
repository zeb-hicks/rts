precision highp float;
#extension GL_OES_texture_float : enable
#extension GL_OES_texture_float_linear : enable

uniform sampler2D diffuse;
uniform sampler2D diffmip;
uniform sampler2D diffblur;
uniform float exposure;

varying vec2 uv;

void main() {
	vec3 C, D, B, M;

	C = texture2D(diffuse, uv).xyz;
	M = texture2D(diffmip, uv).xyz;
	B = texture2D(diffblur, uv).xyz;
	vec3 bloom = pow(B - vec3(0.9), vec3(3.0));

	gl_FragColor = vec4(C, 1.0);
}