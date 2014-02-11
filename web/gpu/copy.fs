precision highp float;
#extension GL_OES_texture_float : enable
#extension GL_OES_texture_float_linear : enable

uniform sampler2D map;
varying vec2 uv;

void main() {
	gl_FragColor = vec4(texture2D(map, uv).xyz, 1.0);
}