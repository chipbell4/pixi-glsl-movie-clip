PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.png')
PIXI.loader.add('TreetopCity_Zone1_Run1_0_frames', 'TreetopCity_Zone1_Run1_0.json');

PIXI.loader.once('complete', function() {
  console.log('Loaded');

  var frames = [];
  for(var i = 222; i <= 228; i++) {
    frames.push('Treetop_DDD_Zone1_1_to_' + i + '.png');
  }

  var frameData = PIXI.loader.resources["TreetopCity_Zone1_Run1_0_frames"].data.frames;

  var sprite = new PIXI.Sprite(PIXI.loader.resources.TreetopCity_Zone1_Run1_0.texture);
  stage.addChild(sprite);

  render();
});

PIXI.loader.load();
