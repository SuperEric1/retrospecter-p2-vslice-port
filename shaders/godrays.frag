#pragma header

const int NUM_SAMPLES = 50;
const float Exposure = 0.4; // Directly scale the effect (0 = no effect, 1 = full)
const float MyDecay = 1.0;

float Weight = 1.0 / float(NUM_SAMPLES);
float Decay = 1.0 - MyDecay / float(NUM_SAMPLES);

uniform vec2 _LightPos;

float occlusion(vec2 q)
{
	float i = clamp(length(q-_LightPos), 0.0, 1.0);
	i = 1.0 - i*i;

	float k = 1.0-flixel_texture2D(bitmap,q).a;

	return mix(k, i, k);
}

// god ray effect
vec4 godray(vec2 texCoord)
{
	vec4 color = vec4(0,0,0,0);
	float illuminationDecay = 1.0;

	vec2 sampleStep = (_LightPos - texCoord) * Weight;

	for (int i = 0; i < NUM_SAMPLES; i++)
	{
		vec2 uv = (sampleStep * float(i)) + texCoord;

		float sampl = occlusion(uv);
		color += sampl * illuminationDecay * Weight;
		illuminationDecay *= Decay;
	}
	return vec4( color * Exposure );
}

void main()
{
	vec2 uv = openfl_TextureCoordv.xy;
	vec2 fragCoord = uv * openfl_TextureSize.xy;

	vec4 gr = godray(uv);
	gl_FragColor = gr + flixel_texture2D(bitmap, uv);
}