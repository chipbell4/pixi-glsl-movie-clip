var AnimationFilter = function(frames, frameRate) {
  frames = frames || [
    { x: 0, y: 0, z: 0.5, w: 0.5},
    { x: 0, y: 0.5, z: 0.5, w: 0.5},
    { x: 0.5, y: 0, z: 0.5, w: 0.5}
  ];

  frameRate = frameRate || 30;

  var TOTAL_FRAMES = frames.length;

  var fragmentShader = [
    'precision lowp float;',

    // The normal PIXI uniforms: The UV of the texture, and the tint value
    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',
    
    // The total number of frames in the animation, plus the actual frames of the animation, defined as vec4, where
    // x = left, y = top, z = width, and w = height
    'const int TOTAL_FRAMES =' + TOTAL_FRAMES + ';',
    'uniform vec4 frames[' + TOTAL_FRAMES + '];',

    // The timestamp of when the animation was started
    'uniform int animationStart;',
    
    // The current timestamp, updated by the tick method below
    'uniform int currentTime;',

    // The frame associated with the animation
    'uniform int frameRate;',

    // Gets the current frame index, based off the current time
    'int getCurrentFrame(void) {',
    '  float animationDurationInMillis = float(TOTAL_FRAMES) / float(frameRate) * 1000.0;',
    '  float elapsedMillis = float(currentTime - animationStart);',
    '  float percentageComplete = mod(elapsedMillis, animationDurationInMillis) / animationDurationInMillis;',
    '  return int(percentageComplete * float(TOTAL_FRAMES));',
    '}',

    // Gets the vec4 representing the current frame bounds
    'vec4 selectFrame(const int frameIndex) {',
    '  vec4 frame = frames[0];',
    '  for(int i = 0; i < TOTAL_FRAMES; i++) {',
    '    if(i == frameIndex) {',
    '      frame = frames[i];',
    '    }',
    '  }',
    '  return frame;',
    '}',

    // Main entry point, gets the current frame and then scopes the current UV coordinate to that frame
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
      value: frames
    },
    frameRate: {
      type: 'i',
      value: frameRate
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
