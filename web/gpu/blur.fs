precision highp float;
#extension GL_OES_texture_float : enable
#extension GL_OES_texture_float_linear : enable

uniform sampler2D map;
uniform vec2 res;
uniform int pass;

varying vec2 uv;

void main() {
	float kernel[9];
	kernel[0] = kernel[8] = 0.00013383062461475853;
	kernel[1] = kernel[7] = 0.004431861620031561;
	kernel[2] = kernel[6] = 0.05399112742070575;
	kernel[3] = kernel[5] = 0.2419714456566007;
	kernel[4] = 0.3989434693560944;
	vec3 C;
	vec2 delta = vec2(1.0) / res;

	for (float i = -4.0; i <= 4.0; i++) {
		if (pass == 0) {
			C += texture2D(map, uv + delta * vec2(i, 0.0)).xyz * kernel[int(i+2.0)];
		} else {
			C += texture2D(map, uv + delta * vec2(0.0, i)).xyz * kernel[int(i+2.0)];
		}
	}

	gl_FragColor = vec4(C, 1.0);
}