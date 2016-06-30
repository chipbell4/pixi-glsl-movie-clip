var AnimationFilter = function() {
  var fragmentShader = [
    'precision lowp float;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'uniform sampler2D uSampler;',
    
    // animation things
    'uniform int animationStart;',
    'uniform int currentTime;',
    'uniform int frameRate;',
    'uniform int totalFrames;',
    'uniform vec4 frames[256];',

    'void main(void){',
    //'   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
    '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
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
    totalFrames: {
      type: 'i',
      value: 3
    },
    frameRate: {
      type: 'i',
      value: 30
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
