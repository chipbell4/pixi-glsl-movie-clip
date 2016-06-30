var AnimationFilter = function() {
  var TOTAL_FRAMES = 4; // TODO: passed via constructor

  var fragmentShader = [
    'precision lowp float;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',
    
    // animation things
    'const int TOTAL_FRAMES =' + TOTAL_FRAMES + ';',
    'uniform vec4 frames[' + TOTAL_FRAMES + '];',
    'uniform int animationStart;',
    'uniform int currentTime;',
    'uniform int frameRate;',

    'int getCurrentFrame(void) {',
    '  float animationDurationInMillis = float(TOTAL_FRAMES) / float(frameRate) * 1000.0;',
    '  float elapsedMillis = float(currentTime - animationStart);',
    '  float percentageComplete = mod(elapsedMillis, animationDurationInMillis) / animationDurationInMillis;',
    '  return int(percentageComplete * float(TOTAL_FRAMES));',
    '}',

    'vec4 selectFrame(const int frameIndex) {',
    '  vec4 frame = frames[0];',
    '  for(int i = 0; i < TOTAL_FRAMES; i++) {',
    '    if(i == frameIndex) {',
    '      frame = frames[i];',
    '    }',
    '  }',
    '  return frame;',
    '}',

    'void main(void){',
    '  int frameIndex = getCurrentFrame();',
    '  vec4 frame = selectFrame(frameIndex);',
    '  vec2 frameUV = frame.xy + frame.zw * vTextureCoord;',
    '  gl_FragColor = texture2D(uSampler, frameUV) * vColor;',
    '}'
  ].join('\n');

  var uniforms = {
    frames: {
      type: 'v4v',
      value: [
        { x: 0, y: 0, z: 0.5, w: 0.5},
        { x: 0, y: 0.5, z: 0.5, w: 0.5},
        { x: 0.5, y: 0, z: 0.5, w: 0.5}
      ]
    },
    frameRate: {
      type: 'i',
      value: 3
    },
    animationStart: {
      type: 'i',
      value: Date.now()
    },
    currentTime: {
      type: 'i',
      value: Date.now()
    }
  };

  PIXI.AbstractFilter.call(this, null, fragmentShader, uniforms);
};

AnimationFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
AnimationFilter.prototype.constructor = AnimationFilter;

AnimationFilter.prototype.tick = function() {
  this.uniforms.currentTime.value = Date.now();
};
