#pragma header

uniform float iTime;

void main()
{
	vec2 uv = openfl_TextureCoordv;
	vec2 size = openfl_TextureSize;

	uv.y += (cos((uv.y + ((iTime + 1.4) * 0.04)) * 45.0) * 0.0009) + (cos((uv.y + ((iTime + 1.4) * 0.1)) * 10.0) * 0.001);
	uv.x += (sin((uv.y + (iTime * 0.07)) * 15.0) * 0.0019) + (sin((uv.y + (iTime * 0.1)) * 15.0) * 0.001);

	if(uv.x > 1.0 - 1.0/size.x) uv.x = 1.0 - 1.0/size.x;
	if(uv.y > 1.0 - 1.0/size.y) uv.y = 1.0 - 1.0/size.y;

	gl_FragColor = texture2D(bitmap, uv);
}