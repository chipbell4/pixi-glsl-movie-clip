var AnimationFilter = function() {
  var fragmentShader = null;

  var uniforms = {
  };

  PIXI.AbstractFilter.call(this, null, fragmentShader, uniforms);
};

AnimationFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
AnimationFilter.prototype.constructor = AnimationFilter;
