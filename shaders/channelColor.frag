#pragma header

uniform vec4 redColor;
uniform vec4 greenColor;
uniform vec4 blueColor;

void main()
{
	vec4 color = flixel_texture2D(bitmap, openfl_TextureCoordv);

	vec4 result = vec4(0.0, 0.0, 0.0, color.a);

	result += color.r * redColor;
	result += color.g * greenColor;
	result += color.b * blueColor;

	result.a = color.a;

	gl_FragColor = result * openfl_Alphav;
}
