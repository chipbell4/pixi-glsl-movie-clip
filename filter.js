PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.png')
PIXI.loader.add('TreetopCity_Zone1_Run1_0_frames', 'TreetopCity_Zone1_Run1_0.json');

var animators = [];
var makeSprite = function(animationFilterFrames) {
  var sprite = new PIXI.Sprite(PIXI.loader.resources.TreetopCity_Zone1_Run1_0.texture);
  var aspectRatio = 159 / 210;
  sprite.width = 100;
  sprite.height = sprite.width * aspectRatio;
  
  sprite.position.x = Math.random() * 800;
  sprite.position.y = Math.random() * 600;
  
  var filter = new MovieClipFilter({
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

var tick = function() {
  animators.forEach(function(animator) {
    animator.tick();
  });

  requestAnimationFrame(tick);
}

PIXI.loader.once('complete', function() {
  var frames = [];
  for(var i = 222; i <= 228; i++) {
    frames.push('Treetop_DDD_Zone1_1_to_' + i + '.png');
  }

  var parentTexture = PIXI.loader.resources["TreetopCity_Zone1_Run1_0"].texture;
  var textureMap = PIXI.loader.resources["TreetopCity_Zone1_Run1_0_frames"].data.frames;
  var animationFilterFrames = MovieClipFilter.extractFrameDescriptions(textureMap, frames, parentTexture);

  for(var i = 0; i < 1000; i++) {
    makeSprite(animationFilterFrames);
  }

  render();
  tick();
});

PIXI.loader.load();
