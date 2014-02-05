precision highp float;

#extension GL_OES_standard_derivatives : enable

uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tSpecular;

varying vec3 worldpos;
varying vec3 normal;
varying vec2 uv;
varying vec3 bc;

float edgeFactor(){
    vec3 d = fwidth(bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
    return min(min(a3.x, a3.y), a3.z);
}

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 tex_norm ) {

	vec3 q0 = dFdx( eye_pos.xyz );
	vec3 q1 = dFdy( eye_pos.xyz );
	vec2 st0 = dFdx( uv.st );
	vec2 st1 = dFdy( uv.st );

	vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
	vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
	vec3 N = normalize( surf_norm );

	mat3 tsn = mat3( S, T, N );
	return normalize( tsn * tex_norm );

}

void main() {
	vec3 diff = texture2D(tDiffuse, uv).xyz;
	vec3 tn = texture2D(tNormal, uv).xyz * 2.0 - 1.0;
	vec3 eyepos = -worldpos;
	vec3 norm = perturbNormal2Arb(eyepos, normal, tn);
	float light = dot(norm, vec3(0.0, 0.0, 1.0));
	vec3 spec = max(vec3(0.0), texture2D(tSpecular, uv).xyz * pow(light, 24.0) * 0.8);
	vec3 color = diff * light + vec3(1.0) * spec;

	gl_FragColor = vec4(mix(vec3(1.0), color, edgeFactor()), 1.0);
	// gl_FragColor = vec4(color, 1.0);
}