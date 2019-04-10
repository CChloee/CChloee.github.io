//set up the canvas
const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');


//Drawing event on canvas (MouseEvent)
context.strokeStyle = '#ff4141';
context.lineWidth = 5;
context.lineJoin = "round";
context.lineCap = "round";

let drawing = false;

document.addEventListener('mousedown', function (event){
  drawing = true;
  context.moveTo(event.pageX, event.pageY);
  context.beginPath();
})

document.addEventListener('mouseup', function (event){
  drawing = false;
})

document.addEventListener('mousemove', function (event) {
  if (drawing){
    context.lineTo(event.pageX, event.pageY);
    context.stroke();
  }
})

//---------------Finger drawing on canvas (touchEvent)------------------
// function
var mousePos = {x:0, y:0};
var lastPos = mousePos;

canvas.addEventListener('touchstart', function(e){
      mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener('touchend', function(e){
  var mouseEvent = new MouseEvent('mouseup',{});
  canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener('touchmove', function(e){
  var touch = e.touchs[0];
  var mouseEvent = new MouseEvent('mousemove',{
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

//Get the position of a touch relative to the Canvas
function getTouchPos(canvasDom, touchEvent){
  var rect = canvasDOM.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

//Prevent scrolling when touching the canvas
document.body.addEventListener('touchstart', function (e){
  if (e.target == canvas){
    e.preventDefault();
  }
}, false);

document.body.addEventListener('touchend', function (e){
  if (e.target == canvas){
    e.preventDefault();
  }
}, false);

document.body.addEventListener('touchmove', function(e){
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);

//--------------------------------------------------------------------


//Color swatches
document.querySelectorAll('nav a').forEach(link =>{
  link.addEventListener('click', function(event){
    context.strokeStyle = this.style.backgroundColor
  })
})


//Clear Canvas Effect
function clearCanvas(){
  clickX = new Array ();
  clickY = new Array();
  clickDrag = new Array ();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}


//Bursh Size Slider
$("#brushSize").on('input', function(e){
  var v = $(this).val();
  context.lineWidth = v;
  $('#val').html($(this).val());
  $('#val').width(v).height(v);
});


//Erase
function erase(){
  context.globalCompositeOperation = "destination-out";
  context.strokeStyle = "rgba(255, 255, 255)";
  context.fillStyle = "rgba(255, 0, 0, 0)";
  context.lineWidth = 5;
}


//Submit Drawing
function submitDrawing (){
  window.location.href = 'CommentGallery.html';
}


//Back to previous page
function backTo_id() {
  window.location.href = 'index.html';
}
