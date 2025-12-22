#pragma header

uniform float iTime;
uniform vec2 uScroll;

void main()
{
	vec2 uv = openfl_TextureCoordv;

	mat3 transformMatrix = mat3(
		vec3(-2.0, -1.0, 0.0),
		vec3(3.0, -1.0, 1.0),
		vec3(1.0, -1.0, -1.0)
	);

	vec4 k = vec4(iTime)*0.8;
	k.xy = (uv + uScroll) * 7.0;
	float val1 = length(0.5 - fract(k.xyw *= transformMatrix * 0.5));
	float val2 = length(0.5 - fract(k.xyw *= transformMatrix * 0.2));
	float val3 = length(0.5 - fract(k.xyw *= transformMatrix * 0.5));
	float minVal = min(min(val1, val2), val3);

	vec4 color = texture2D(bitmap, uv);

	gl_FragColor = vec4(pow(minVal, 7.0) * 3.0 * color.a) + color;
}