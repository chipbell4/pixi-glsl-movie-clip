var AnimationFilter = function(options) {
  options = options || {};

  if(options.frames === undefined || options.frames.length === 0) {
    throw new Error('options.frames must be an array');
  }

  options.framerate = options.framerate || 30;

  var fragmentShader = [
    'precision lowp float;',

    // The normal PIXI uniforms: The UV of the texture, and the tint value
    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',
    
    // The total number of frames in the animation, plus the actual frames of the animation, defined as vec4, where
    // x = left, y = top, z = width, and w = height
    'const int TOTAL_FRAMES =' + options.frames.length + ';',
    'uniform vec4 frames[' + options.frames.length + '];',

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

  console.log(fragmentShader);

  var uniforms = {
    frames: {
      type: 'v4v',
      value: options.frames
    },
    frameRate: {
      type: 'i',
      value: options.framerate
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
