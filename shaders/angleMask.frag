#pragma header

uniform vec3 extraTint;
uniform vec2 endPosition;
uniform float startOffset;
uniform vec4 uFrameBounds;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec4 mainPass(vec2 fragCoord) {
  vec4 base = texture2D(bitmap, fragCoord);

  vec2 start = vec2(uFrameBounds.x + (startOffset / openfl_TextureSize.x), uFrameBounds.y);
  vec2 end   = vec2(uFrameBounds.x + (endPosition.x / openfl_TextureSize.x), uFrameBounds.w);

  float dx = end.x - start.x;
  float dy = end.y - start.y;

  float angle = atan(dy, dx);

  vec2 uv = fragCoord.xy;
  uv.x -= start.x;
  uv.y -= start.y;

  float uvA = atan(uv.y, uv.x);

  if (uvA < angle)
    return base;
  else
    return vec4(0.0);
}

vec4 antialias(vec2 fragCoord) {
  const float AA_STAGES = 2.0;
  const float AA_TOTAL_PASSES = AA_STAGES * AA_STAGES + 1.0;
  const float AA_JITTER = 0.5;

  vec4 color = mainPass(fragCoord);
  for (float x = 0.0; x < AA_STAGES; x++) {
    for (float y = 0.0; y < AA_STAGES; y++) {
      vec2 offset = AA_JITTER * (2.0 * hash22(vec2(x, y)) - 1.0) / openfl_TextureSize.xy;
      color += mainPass(fragCoord + offset);
    }
  }
  return color / AA_TOTAL_PASSES;
}

void main() {
  vec4 col = antialias(openfl_TextureCoordv);
  col.xyz = col.xyz * extraTint.xyz;
  gl_FragColor = col;
}
