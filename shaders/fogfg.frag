#pragma header
// Originally from https://www.shadertoy.com/view/7ldGWf

//const vec3 COLOR = vec3(255.0/255.0, 42.0/255.0, 96.0/255.0)*1.5;
uniform vec3 uColor;  // 0xFF1F1F
uniform vec3 uBgColor;
uniform float uIntensity;
//const vec3 BG = vec3(0.0, 0.0, 0.0);
const float ZOOM = 3.0;
const int OCTAVES = 4;
const float INTENSITY = 2.0;

uniform float iTime;

float random (vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9818,79.279)))*43758.5453123);
}

vec2 random2(vec2 st){
	st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
	return -1.0 + 2.0 * fract(sin(st) * 7.0);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	// smootstep
	vec2 u = f*f*(3.0-2.0*f);

	return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
					 dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
				mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
					 dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}


float fractal_brownian_motion(vec2 coord) {
	float value = 0.0;
	float scale = 0.2;
	for (int i = 0; i < 4; i++) {
		value += noise(coord) * scale;
		coord *= 2.0;
		scale *= 0.5;
	}
	return value + 0.2;
}

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

float blendAdd(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
	return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}
float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

float blendReflect(float base, float blend) {
	return (blend==1.0)?blend:min(base*base/(1.0-blend),1.0);
}

vec3 blendReflect(vec3 base, vec3 blend) {
	return vec3(blendReflect(base.r,blend.r),blendReflect(base.g,blend.g),blendReflect(base.b,blend.b));
}

vec3 blendReflect(vec3 base, vec3 blend, float opacity) {
	return (blendReflect(base, blend) * opacity + base * (1.0 - opacity));
}

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
	vec2 uv = openfl_TextureCoordv.xy;
	vec2 st = uv;// * openfl_TextureSize.xy / openfl_TextureSize.y;
	vec2 pos = vec2(st * ZOOM);
	vec2 motion = vec2(fractal_brownian_motion(pos + vec2(iTime * -0.5, iTime * -0.3)));
	float final = fractal_brownian_motion(pos + motion) * INTENSITY;
	vec4 bg = flixel_texture2D(bitmap, uv);

	//float intensity = sin(iTime) * 0.5 + 0.5;

	float apply = smoothstep(0.3, 1.0, uv.y);
	float alpha = final * uIntensity * apply * 4.0;

	//vec3 col = uColor * alpha;//blendLighten(bg.rgb, uColor, final * intensity);
	vec3 col = blendSoftLight(bg.rgb, uColor, alpha);//vec3(bg.rgb * bg.a, bg.a * openfl_Alphav);
	//vec3 col = uColor * alpha;
	//col.rgb = mix(mix(col.rgb, uBgColor, intensity), uColor, final * intensity);
	gl_FragColor = vec4(col, max(bg.a, alpha));//vec4(bg.rgb * bg.a, bg.a * openfl_Alphav);
}