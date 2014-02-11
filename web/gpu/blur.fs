precision highp float;
#extension GL_OES_texture_float : enable
#extension GL_OES_texture_float_linear : enable

uniform sampler2D map;
uniform vec2 res;
uniform int pass;

varying vec2 uv;

void main() {
	float kernel[5];
	kernel[0] = kernel[4] = 0.05399096651318985;
	kernel[1] = kernel[3] = 0.24197072451914536;
	kernel[2] = 0.3989422804014327;
	vec3 C;
	vec2 delta = vec2(1.0) / res;

	for (float i = -2.0; i <= 2.0; i++) {
		if (pass == 0) {
			C += texture2D(map, uv + delta * vec2(i, 0.0) * kernel[int(i)+2]).xyz;
		} else {
			C += texture2D(map, uv + delta * vec2(0.0, i) * kernel[int(i)+2]).xyz;
		}
	}

	gl_FragColor = vec4(C, 1.0);
}