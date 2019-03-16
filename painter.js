const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');


//Drawing on Painter
context.strokeStyle = '#ff4141';
context.lineWidth = 5;
context.lineJoin = "round";
context.lineCap = "round";

let shouldPaint = false;

document.addEventListener('mousedown', function (event){
  shouldPaint = true;
  context.moveTo(event.pageX, event.pageY);
  context.beginPath();
})

document.addEventListener('mouseup', function (event){
  shouldPaint = false;
})

document.addEventListener('mousemove', function (event) {
  if (shouldPaint){
    context.lineTo(event.pageX, event.pageY);
    context.stroke();
  }
})


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
