var TOTAL_ANIMATORS = 20000;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);;

// create a renderer instance.
renderer = PIXI.autoDetectRenderer(800, 600);
  
// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

var lastFrameTime, lastFrameDuration;
function render() {
  var now = Date.now();
  if(lastFrameTime !== undefined) {
    lastFrameDuration = now - lastFrameTime;
  }
  lastFrameTime = now;

  renderer.render(stage);
  requestAnimationFrame(render);
}

var frameRateContainer = document.getElementById('frame-rate');
setInterval(function() {
  if(lastFrameDuration == undefined) {
    return;
  }

  frameRateContainer.innerHTML = (1000 / lastFrameDuration).toFixed(1);
}, 500);
