uniform vec4 region;
attribute vec2 uvs;
varying vec2 uv;

void main() {
	uv = uvs;
	gl_Position = vec4((uv * 2.0 - vec2(1.0)) * region.zw + region.xy, 0.0, 1.0);
}