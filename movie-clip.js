PIXI.loader.add('TreetopCity_Zone1_Run1_0', 'TreetopCity_Zone1_Run1_0.json');

var createClip = function() {
  var fps = 30;
  var textures = [];
  for(var i = 222; i <= 228; i++) {
    var path = PIXI.loader.resources['TreetopCity_Zone1_Run1_0'].textures['Treetop_DDD_Zone1_1_to_' + i + '.png'];
    textures.push({
      texture: path,
      time: 1000 / fps
    });
  }

  var clip = new PIXI.extras.MovieClip(textures);

  var aspectRatio = 159 / 210;
  clip.width = 40;
  clip.height = clip.width * aspectRatio;
  clip.position.x = Math.random() * 800;
  clip.position.y = Math.random() * 600;
  clip.scale.x *= Math.random() < 0.5 ? -1 : 1;

  clip.gotoAndPlay(Math.floor(Math.random() * textures.length));

  stage.addChild(clip);
};

PIXI.loader.once('complete', function() {
  for(var i = 0; i < TOTAL_ANIMATORS; i++) {
    createClip();
  }

  render();
});

PIXI.loader.load();
