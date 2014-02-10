precision highp float;

#extension GL_OES_standard_derivatives : enable

const int LIGHT_COUNT = 8; // Need to inject this depending on GPU caps, rather than hard coded.

uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tSpecular;
uniform sampler2D tHeight;
uniform vec3 lightPos[LIGHT_COUNT]; // X Y Z
uniform vec4 lightData[LIGHT_COUNT]; // R G B Luminosity
uniform vec2 lightInfo[LIGHT_COUNT]; // Type Cast_Shadow - Types: Ambient=1, Point=2, Dir=3, Spot=4

uniform float parallaxAmount;

uniform vec3 cameraPosition;

varying vec3 worldpos;
varying vec3 eyepos;
varying vec3 normal;
varying vec2 uv;
varying vec3 bc;

// For wireframe display.
float edgeFactor(){
    vec3 d = fwidth(bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
    return min(min(a3.x, a3.y), a3.z);
}

mat3 TSN( vec3 eye_pos, vec3 surf_norm ) {

	vec3 q0 = dFdx( eye_pos.xyz );
	vec3 q1 = dFdy( eye_pos.xyz );
	vec2 st0 = dFdx( uv.st );
	vec2 st1 = dFdy( uv.st );

	vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
	vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
	vec3 N = normalize( surf_norm );

	return mat3( S, T, N );
}

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 tex_norm ) {
	return normalize( TSN(eye_pos, surf_norm) * tex_norm );
}

vec3 diffuseMap(vec2 uv) {
	return texture2D(tDiffuse, uv).xyz; // Grab diffuse map texel for this fragment.
}

vec3 normalMap(vec3 fnorm, vec3 eye, vec2 uv) {
	vec3 tn = normalize(texture2D(tNormal, uv).xyz * 2.0 - 1.0); // Get texture normal.
	return normalize(perturbNormal2Arb(eye, fnorm, tn)); // Perturb normal as per matrices.
}

vec2 parallaxOffset(vec2 uv) {
	vec2 pxuv = uv;
	float height;
	float variance;
	vec2 ov = normalize(eyepos * TSN(eyepos, normal)).xy;
	
	height = texture2D(tHeight, uv).x; // Get height value from texture.
	variance = height * parallaxAmount - parallaxAmount * 0.5; // Multiply by tuning value.
	pxuv += ov * variance;
	height = texture2D(tHeight, uv).x; // Get height value from texture.
	variance = height * parallaxAmount - parallaxAmount * 0.5; // Multiply by tuning value.
	pxuv += ov * variance;
	height = texture2D(tHeight, uv).x; // Get height value from texture.
	variance = height * parallaxAmount - parallaxAmount * 0.5; // Multiply by tuning value.
	pxuv += ov * variance;

	return pxuv; // Offset original uv coords.
}

// Calculate lighting with surface normal (May need more info for more complex calc, such as world pos or surface texture.
vec3 calcLight(vec3 n, vec2 uv) {

	vec3 light;

	float reflectivity = 0.2;
	float specularity = 8.0;
	float roughness = 2.0;
	vec3 specMap = texture2D(tSpecular, uv).xyz;

	for (int li = 0; li < LIGHT_COUNT; li++) {

		if (lightInfo[li].x == 1.0) { // Ambient light.

			light += lightData[li].xyz * lightData[li].w;

		}

		if (lightInfo[li].x == 2.0) { // Point light.
			
			// TODO: Direct lighting

			// TODO: Specular

		}

		if (lightInfo[li].x == 3.0) { // Directional light.
			
			// TODO: Direct lighting

			// TODO: Specular
			
		}

		if (lightInfo[li].x == 4.0) { // Spot light.
			// TODO: Spotlight implementation.
		}

	}

	return light;

}

void main() {

	// vec3 diff = texture2D(tDiffuse, nuv).xyz;
	// vec3 tn = normalize(texture2D(tNormal, nuv).xyz * 2.0 - 1.0);

	// vec3 norm = normalize(perturbNormal2Arb(eye_pos, normal, tn));
	// vec3 rdir = reflect(-vec3(1.0, 0.0, 0.0), norm);

	// vec2 pxuv = uv + (normalize(eyepos * TSN(eyepos, normal)) * hv);

	vec2 pxuv = parallaxOffset(uv);

	vec3 C; // Output color.
	vec3 D = diffuseMap(pxuv); // Diffuse
	vec3 N = normalMap(normal, eyepos, pxuv); // Normal
	vec3 L = calcLight(N, pxuv);

	C = D + L;


	// float light = calcLight(norm);

	// float light = max(0.0, dot(norm, vec3(1.0, 0.0, 0.0))) + 0.1;

	// vec3 spec = max(vec3(0.0), texture2D(tSpecular, nuv).xyz * pow(max(0.0, dot(rdir, normalize(eye_pos))), 3.0));


	// color = diff * light + vec3(1.0) * spec;

	// C = vec3(abs(uv - pxuv) * 10.0, 0.0);

	// gl_FragColor = vec4(color, 1.0);
	gl_FragColor = vec4(mix(vec3(1.0), C, edgeFactor()), 1.0);
	// gl_FragColor = vec4(vec3(light), 1.0);
	// gl_FragColor = vec4(mix(vec3(1.0), diff, edgeFactor()), 1.0);
	// gl_FragColor = vec4(uv - nuv, 0.0, 1.0);
}