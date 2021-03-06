/**
 * The MovieClipFilter class. Applies a filter to a large texture to loop over subrectangles of the texture to make it
 * animated
 *
 * @param {options.frames} Array An array of vec4's describing the frames of the animation: { x: left, y: top, z: width, w: height }
 * @param {options.viewportDimensions} Object A vec2 describing the height and width of the viewport { x: width, y: height }
 * @param {options.spriteDimensions} Object A vec2 describing the height and width of the sprite { x: width, y: height }
 * @param {options.framerate} Number The number of frames per second to run the animation at
 */
var MovieClipFilter = function(options) {
  options = options || {};

  if(options.frames === undefined || options.frames.length === 0) {
    throw new Error('options.frames must be an array');
  }

  if(options.viewportDimensions === undefined) {
    throw new Error('Need viewportDimensions. renderer.width and renderer.height should suffice');
  }

  if(options.spriteDimensions === undefined) {
    throw new Error('Need spriteDimensions. sprite.width and sprite.height should suffice');
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
    'uniform int framerate;',

    // The viewport and sprite sizes, so we can do UV math properly
    'uniform vec2 spriteDimensions;',
    'uniform vec2 viewportDimensions;',

    // converts a coordinate to local texture coordinates
    'vec2 toLocalCoordinates(vec2 uv) {',
    '  return uv * viewportDimensions / spriteDimensions;',
    '}',

    'vec2 toGlobalCoordinates(vec2 uv) {',
    '  return uv * spriteDimensions / viewportDimensions;',
    '}',


    // Gets the current frame index, based off the current time
    'int getCurrentFrame(void) {',
    '  float animationDurationInMillis = float(TOTAL_FRAMES) / float(framerate) * 1000.0;',
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
    '  vec2 localCoordinates = toLocalCoordinates(vTextureCoord);',
    '  vec2 frameUV = frame.xy + frame.zw * localCoordinates;',
    '  vec2 globalCoordinates = toGlobalCoordinates(frameUV);',
    '  gl_FragColor = texture2D(uSampler, globalCoordinates) * vColor;',
    '}'
  ].join('\n');

  var uniforms = {
    frames: {
      type: 'v4v',
      value: options.frames
    },
    framerate: {
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
    },
    spriteDimensions: {
      type: 'v2',
      value: options.spriteDimensions
    },
    viewportDimensions: {
      type: 'v2',
      value: options.viewportDimensions
    }
  };

  PIXI.AbstractFilter.call(this, null, fragmentShader, uniforms);
};

MovieClipFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
MovieClipFilter.prototype.constructor = MovieClipFilter;

/**
 * Ticks the animation to the current time. Needs to run every frame
 */
MovieClipFilter.prototype.tick = function() {
  this.uniforms.currentTime.value = Date.now();
};

/**
 * Helper method to extract frame information to be passed as filter options.
 * @see filter.js
 * @param {Object} textureMap A key -> PIXI.Texture from the PIXI loader for a spritesheet
 * @param {Array[String]} frameNames The names of the frames to use in the animation from the texture map
 * @param {PIXI.Texture} parentTexture The containing texture for all of the images
 */
MovieClipFilter.extractFrameDescriptions = function(textureMap, frameNames, parentTexture) {
  var width = parentTexture.width;
  var height = parentTexture.height;

  return frameNames.map(function(frameName) {
    var frameDescription = textureMap[frameName].frame;
    return {
      x: frameDescription.x / width,
      y: frameDescription.y / height,
      z: frameDescription.w / width,
      w: frameDescription.h / height
    };
  });
};
