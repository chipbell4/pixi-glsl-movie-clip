PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.png')
PIXI.loader.add('TreetopCity_Zone1_Run1_0_frames', 'TreetopCity_Zone1_Run1_0.json');

var animators = [];
var makeSprite = function(animationFilterFrames) {
  var sprite = new PIXI.Sprite(PIXI.loader.resources.TreetopCity_Zone1_Run1_0.texture);
  var aspectRatio = 159 / 210;
  sprite.width = 100;
  sprite.height = sprite.width * aspectRatio;
  
  var filter = new AnimationFilter({
    frames: animationFilterFrames,
    framerate: 15,
    spriteDimensions: { x: sprite.width, y: sprite.height },
    viewportDimensions: { x: renderer.width, y: renderer.height },
  });

  animators.push(filter);

  sprite.filters = [filter];

  stage.addChild(sprite);

  return sprite;
};

PIXI.loader.once('complete', function() {
  var frames = [];
  for(var i = 222; i <= 228; i++) {
    frames.push('Treetop_DDD_Zone1_1_to_' + i + '.png');
  }

  var parentTexture = PIXI.loader.resources["TreetopCity_Zone1_Run1_0"].texture;
  var textureMap = PIXI.loader.resources["TreetopCity_Zone1_Run1_0_frames"].data.frames;
  var animationFilterFrames = AnimationFilter.extractFrameDescriptions(textureMap, frames, parentTexture);

  makeSprite(animationFilterFrames);

  render();

  var tick = function() {
    animators.forEach(function(animator) {
      animator.tick();
    });

    requestAnimationFrame(tick);
  };

  tick();
});

PIXI.loader.load();
