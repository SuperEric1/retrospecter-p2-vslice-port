#pragma header

const int NUM_SAMPLES = 50;
const float Exposure = 0.4; // Directly scale the effect (0 = no effect, 1 = full)
//const float MyDecay = 1.8;
const float MyDecay = 1.0;
const float CircleSize = 1.0;
//const float CircleSize = 0.1;

const float WEIGHT = 1.0 / float(NUM_SAMPLES);
const float DECAY = 1.0 - MyDecay / float(NUM_SAMPLES);
const float INV_SAMPLE_COUNT_MINUS_ONE = 1.0 / float(NUM_SAMPLES - 1);

vec2 LightPos;
uniform vec2 _LightPos;

// green screen effect on input texture where the foreground is made black, with a white gradient dot as background
float occlusion(vec2 q)
{
	float i = clamp(length((q-LightPos)*vec2(openfl_TextureSize.x/openfl_TextureSize.y, 1.0))/CircleSize, 0.0, 1.0);
	i = 1.0 - i*i;

	float k = 1.0 - flixel_texture2D(bitmap, q).a;
	return mix(k, i, k);
}


// god ray effect
float godray(vec2 texCoord)
{
	float color = 0.0;
	// Set up illumination decay factor.
	float illuminationDecay = 1.0;
	// Evaluate summation from Equation 3 NUM_SAMPLES iterations.
	for (int i = 0; i < NUM_SAMPLES; i++)
	{
		// Step sample location along ray.
		vec2 uv = mix(texCoord, LightPos, float(i) * INV_SAMPLE_COUNT_MINUS_ONE);

		// Retrieve sample at new location.
		float sampl = occlusion(uv);
		// Apply sample attenuation scale/decay factors.
		sampl *= illuminationDecay * WEIGHT;
		// Accumulate combined color.
		color += sampl;
		// Update exponential decay factor.
		illuminationDecay *= DECAY;
	}
	return color * Exposure;
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

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
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

void main()
{
	vec2 uv = openfl_TextureCoordv.xy;
	LightPos = _LightPos;// / openfl_TextureSize.xy;
	// fragColor = godray(uv) + vec4(greenscreen(uv),1);
	// fragColor = vec4(greenscreen(uv),1);
	float gr = godray(uv);
	vec4 cola = flixel_texture2D(bitmap, uv);
	vec3 col = blendNormal(cola.rgb, vec3(gr * 6.0), 0.3);
	//vec3 col = blendAdd(cola.rgb, clamp(gr.rgb*1.0, 0.0, 1.0), 1.0);
	gl_FragColor = vec4(col, max(cola.a, gr));
}
