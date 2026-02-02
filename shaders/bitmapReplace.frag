#pragma header
uniform sampler2D replaceBitmap;
uniform vec2 replaceBitmapRatio;
uniform vec2 replaceBitmapOffset;
uniform float replaceBitmapScale;
uniform bool debugShowImage;
uniform bool bitmapAntialiasing;

// Thanks Matthew for providing me this shader
vec4 flixel_texture2DCustom(sampler2D bitmap, vec2 coord)
{
	vec4 color = texture2D(bitmap, coord);
	if (!hasTransform)
	{
		return color;
	}

	if(color.a < 0.0) return vec4(0.0, 0.0, 0.0, 0.0);

	bool showImage = false;
	if(color.r > 0.0 && color.a > 0.0) showImage = true;

	color.a *= 1.0 - color.r;
	color.r = color.b = color.g;
	if(showImage || debugShowImage)
	{
		vec4 origColor = color;
		vec2 txtCoord = ((coord - replaceBitmapOffset) / replaceBitmapRatio / replaceBitmapScale);
		vec4 color1, color2, color3, color4, color5;
		color1 = texture2D(replaceBitmap, vec2(txtCoord.x, txtCoord.y));

		if(bitmapAntialiasing)
		{
			float dX = 1.0/1280.0;
			float dY = 1.0/720.0;
			color2 = texture2D(replaceBitmap, vec2(txtCoord.x + dX, txtCoord.y));
			color3 = texture2D(replaceBitmap, vec2(txtCoord.x - dX, txtCoord.y));
			color4 = texture2D(replaceBitmap, vec2(txtCoord.x, txtCoord.y + dY));
			color5 = texture2D(replaceBitmap, vec2(txtCoord.x, txtCoord.y + dY));
			color = (color1 + color2 + color3 + color4 + color5) / 5.0;
		}
		else color = color1;

		if(debugShowImage) return color;

		vec4 mixColor = (1.0 - origColor.a) * color + origColor.a * origColor;
		if(color.a > 0.0) mixColor.a = 1.0;
		return mixColor;
	}
	return color;
}

void main()
{
	gl_FragColor = flixel_texture2DCustom(bitmap, openfl_TextureCoordv) * openfl_Alphav;
}
