precision highp float;

#extension GL_OES_standard_derivatives : enable

uniform sampler2D tDiffuse;

varying vec3 normal;
varying vec2 uv;
varying vec3 bc;

float edgeFactor(){
    vec3 d = fwidth(bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
    return min(min(a3.x, a3.y), a3.z);
}

void main() {
	vec3 diff = texture2D(tDiffuse, uv).xyz;
	float light = dot(normal, vec3(0.0, 0.0, 1.0));
	vec3 color = diff * light;

	gl_FragColor = vec4(mix(vec3(1.0), color, edgeFactor()), 1.0);
	// gl_FragColor = vec4(color, 1.0);
}