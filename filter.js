PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.png')

PIXI.loader.once('complete', function() {
  console.log('Loaded');

  var sprite = new PIXI.Sprite(PIXI.loader.resources.TreetopCity_Zone1_Run1_0.texture);
  stage.addChild(sprite);

  render();
});

PIXI.loader.load();
