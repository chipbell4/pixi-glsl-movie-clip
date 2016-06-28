// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);;

// create a renderer instance.
renderer = PIXI.autoDetectRenderer(800, 600);
  
// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

function render() {
  renderer.render(stage);
  requestAnimationFrame(render);
}
