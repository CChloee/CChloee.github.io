//set up the canvas
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext('2d');

context.strokeStyle = '#ff4141';
context.lineWidth = 5;
context.lineJoin = "round";
context.lineCap = "round";

// Define some variables to keep track of the touch position
var touchX, touchY;

//---------------Mouse drawing on canvas ---------------------------
var drawing = false;

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
//----------------------------------------------------------------------------


//--------------------------Touch event-----------------------
//----------------------------test 02---------------------------
function canvas_touchStart(){
  getTouchPos();
  drawDot(context, touchX, touchY, 12);

  // Prevents an additional mousedown event being triggered
  event.preventDefault();
}

function canvas_touchMove(e){
  // Update the touch co-ordinates
  getTouchPos(e);
  drawDot(context, touchX, touchY, 12);
  event.preventDefault();
}

function getTouchPos(e){
  if(!e)
    var e = event;

  if(e.touches){
    if(e.touches.length == 1){  // Only deal with one finger
      var touch = e.touches[0];   // Get the information for finger #1
      touchX= touch.pageX-touch.target.offsetLeft;
      touchY= touch.pageY-touch.target.offsetTop;
    }
  }
}

//Set up the canvas and add our event handlers aftre the page has loaded
function init(){
  if (context){
    //React to mouse events on the canvas, and mouseup on the entire document
    canvas.addEventListener('mousedown', canvas_mouseDown, false);
    canvas.addEventListener('mousemove', canvas_mouseMove, false);
    window.addEventListener('mouseup', canvas_mouseUp, false);

    //React to touch events on the canvas
    canvas.addEventListener('touchstart', canvas_touchMove, false);
    canvas.addEventListener('touchmove', canvas_touchMove, false);
  }
}
//---------------Finger drawing on canvas (touchEvent)------------------
//----------------------------------------------------------------------





//----------------------------------------------------------------------
//Color swatches
document.querySelectorAll('nav a').forEach(link =>{
  link.addEventListener('click', function(event){
    context.strokeStyle = this.style.backgroundColor
  })
})



//----------------------------------------------------------------------
//Clear Canvas Effect
function clearCanvas(){
  clickX = new Array ();
  clickY = new Array();
  clickDrag = new Array ();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}



//----------------------------------------------------------------------
//Bursh Size Slider
$("#brushSize").on('input', function(e){
  var v = $(this).val();
  context.lineWidth = v;
  $('#val').html($(this).val());
  $('#val').width(v).height(v);
});



//----------------------------------------------------------------------
//Erase
function erase(){
  context.globalCompositeOperation = "destination-out";
  context.strokeStyle = "rgba(255, 255, 255)";
  context.fillStyle = "rgba(255, 0, 0, 0)";
  context.lineWidth = 5;
}



//----------------------------------------------------------------------
//Submit Drawing
function submitDrawing (){
  window.location.href = 'CommentGallery.html';
}


//----------------------------------------------------------------------
//Back to previous page
function backTo_id() {
  window.location.href = 'index.html';
}
