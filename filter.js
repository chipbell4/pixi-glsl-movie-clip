PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.png')
PIXI.loader.add('TreetopCity_Zone1_Run1_0_frames', 'TreetopCity_Zone1_Run1_0.json');


PIXI.loader.once('complete', function() {
  console.log('Loaded');

  var width = PIXI.loader.resources["TreetopCity_Zone1_Run1_0"].texture.width;
  var height = PIXI.loader.resources["TreetopCity_Zone1_Run1_0"].texture.height;

  var frames = [];
  for(var i = 222; i <= 228; i++) {
    frames.push('Treetop_DDD_Zone1_1_to_' + i + '.png');
  }

  var frameData = PIXI.loader.resources["TreetopCity_Zone1_Run1_0_frames"].data.frames;

  var animationFilterFrames = frames.map(function(frame) {
    var description = frameData[frame].frame;
    console.log(description);
    return {
      x: description.x / width,
      y: description.y / height,
      z: description.w / width,
      w: description.h / height
    };
  });

  console.log(animationFilterFrames);

  var filter = new AnimationFilter({
    frames: animationFilterFrames,
    framerate: 2
  });
  var sprite = new PIXI.Sprite(PIXI.loader.resources.TreetopCity_Zone1_Run1_0.texture);

  sprite.filters = [filter];

  var aspectRatio = 159 / 210;
  sprite.width = 400;
  sprite.height = sprite.width * aspectRatio;

  stage.addChild(sprite);

  render();

  var tick = function() {
    filter.tick();
    requestAnimationFrame(tick);
  };
  tick();
});

PIXI.loader.load();
