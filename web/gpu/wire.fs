precision highp float;

#extension GL_OES_standard_derivatives : enable
#extension GL_OES_texture_float_linear : enable

const int LIGHT_COUNT = 8; // Need to inject this depending on GPU caps, rather than hard coded.

uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tSpecular;
uniform sampler2D tHeight;
uniform sampler2D tAO;
uniform vec3 lightPos[LIGHT_COUNT]; // X Y Z
uniform vec4 lightData[LIGHT_COUNT]; // R G B Luminosity
uniform vec2 lightInfo[LIGHT_COUNT]; // Type Cast_Shadow - Types: Ambient=1, Point=2, Dir=3, Spot=4

uniform float parallaxAmount;

uniform vec3 cameraPosition;

varying vec3 worldpos;
varying vec3 eyepos;
varying vec3 normal;
varying vec3 tangent;
varying vec3 binormal;
varying vec2 uv;
varying vec3 bc;
varying mat3 TBN;
varying vec3 tsEyePos;
varying vec3 tsWorldPos;

// For wireframe display.
float edgeFactor(){
    vec3 d = fwidth(bc);
    vec3 a3 = smoothstep(vec3(0.0), d*1.5, bc);
    return min(min(a3.x, a3.y), a3.z);
}

vec3 diffuseMap(vec2 uv) {
	return texture2D(tDiffuse, uv).xyz; // Grab diffuse map texel for this fragment.
}

vec2 parallaxOffset(vec2 uv) {
	vec2 pxuv = uv;
	vec3 tsE = normalize(tsEyePos - tsWorldPos);
	// vec3 tsE = normalize(-tsEyePos);
	// vec3 tsE = normalize(vec3(0.03, 0.01, 0.01));

	const float numSteps = 48.0;
	const float stepDist = 1.0 / numSteps;

	vec2 delta = vec2(-tsE.x, tsE.y) * parallaxAmount / tsE.z * stepDist;

	// vec2 delta = ov * parallaxAmount / numSteps;
	float hv = texture2D(tHeight, uv).x;
	float height = 1.0;
	// delta *= hv;

	// delta = vec2(0.01, 0.01);

	for (float i = 0.0; i < numSteps; i++) {
		if (hv < height) {
			height -= stepDist;
			pxuv += delta;
			hv = texture2D(tHeight, pxuv).x;
		} else {
			break;
		}
	}

	return pxuv; // Offset original uv coords.
}

// Calculate lighting with surface normal (May need more info for more complex calc, such as world pos or surface texture.
vec3 calcLight(vec3 n, vec2 uv) {

	vec3 light;

	float reflectivity = 0.2;
	float specularity = 8.0;
	float roughness = 2.0;
	vec3 specMap = texture2D(tSpecular, uv).xyz;
	vec3 aoMap = texture2D(tAO, uv).xyz;
	float brightest = 0.0;
	int brightindex = -1;
	vec3 lightDir;
	float lightDot;
	vec3 tsLightPos;
	vec3 light_vector;
	// mat3 TBN = mat3(tangent, binormal, normal);

	for (int li = 0; li < LIGHT_COUNT; li++) {

		if (lightInfo[li].x == 1.0) { // Ambient light.

			light += lightData[li].xyz * lightData[li].w * aoMap;

		}

		if (lightInfo[li].x == 2.0) { // Point light.
			tsLightPos = lightPos[li].xyz * TBN;
			light_vector = normalize(tsLightPos - tsWorldPos);
			// light_vector.x *= -1.0;
		}

		if (lightInfo[li].x == 3.0) { // Directional light.
			tsLightPos = lightPos[li].xyz * TBN;
			light_vector = normalize(tsLightPos);
			// light_vector.x *= -1.0;
		}

		if (lightInfo[li].x == 2.0 || lightInfo[li].x == 3.0) { // Directional light.
			vec3 norm = normalize(n);

			vec3 view_vector = normalize(tsEyePos - tsWorldPos);

			vec3 hvec = normalize(light_vector + view_vector);

			const float shadowSamples = 24.0;
			const float stepDist = 1.0 / shadowSamples;

			vec2 delta = -vec2(-light_vector.x, light_vector.y) * parallaxAmount / light_vector.z * stepDist;

			vec2 shadowOffset = uv;
			float shadowValue = 0.0;
			float dotL = max(0.0, dot(n, light));
			float diff = 0.0;
			float height = texture2D(tHeight, shadowOffset).x;
			if (dotL >= 0.0) {
				for (float ss = 0.0; ss < shadowSamples; ss++) {
					if (height < 1.0) {
						height += stepDist;
						shadowOffset += delta;
						diff = height - texture2D(tHeight, shadowOffset).x;
						if (diff < 0.0) {
							shadowValue -= diff * 4.0;
						}
					} else {
						break;
					}
				}
			}

			// gl_FragColor = vec4(vec3(1.0) * shadowValue, 1.0);
			light += lightData[li].w * lightData[li].xyz * max(0.0, dot(light_vector, norm)) * (1.0 - min(1.0, shadowValue));
			light += lightData[li].w * lightData[li].xyz * pow(max(0.0, dot(hvec, normalize(norm))), 512.0) * texture2D(tSpecular, uv).xyz;
		}

		if (lightInfo[li].x == 4.0) { // Spot light.
			// TODO: Spotlight implementation.
		}

	}

	return light;

}

void main() {

	vec2 pxuv = parallaxOffset(uv);

	vec3 C; // Output color.
	vec3 D = diffuseMap(pxuv); // Diffuse
	vec3 N = normalize(texture2D(tNormal, pxuv).xyz * 2.0 - 1.0); // Normal
	vec3 L = calcLight(N, pxuv); // Lighting

	C = D * L;

	gl_FragColor = vec4(C, 1.0);
}