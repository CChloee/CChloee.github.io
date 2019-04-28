//set up the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

//----------------------------------------------------------------------
// Variable
var isPaint = false;
var lastPointerPosition;
var mode = 'brush';

//----------------------------------------------------------------------
// Setting everything
var stickerLayer;
var drawLayer;

init();

function canvasSetting(){
  drawLayer = new Konva.Layer();
  stage.add(drawLayer);
  // This layer should be bottom so that you can select sticker.
  drawLayer.moveToBottom();

  canvas.width = stage.width();
  canvas.height = stage.height();

  // created canvas we can add to layer as "Konva.Image" element
  var image = new Konva.Image({
    image: canvas,
    x: 0,
    y: 0,
    stroke: 'black',
    shadowBlur: 5,
  });
  drawLayer.add(image);
  drawLayer.draw();

  // Get access to context element
  context.strokeStyle = '#df4b26';
  context.lineJoin = 'round';
  context.lineWidth = 5;

  // Event binding
  image.on('mousedown touchstart', function() {
    isPaint = true;
    lastPointerPosition = stage.getPointerPosition();
    // console.log(stage.getPointerPosition());
  });

  stage.addEventListener('mouseup touchend', function() {
    isPaint = false;
  });

  // Drawing
  stage.addEventListener('mousemove touchmove', function() {
    if (!isPaint) {
      return;
    }

    if (mode === 'brush') {
      context.globalCompositeOperation = 'source-over';
    }
    if (mode === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    }
    context.beginPath();

    var localPos = {
      x: lastPointerPosition.x - image.x(),
      y: lastPointerPosition.y - image.y()
    };
    context.moveTo(localPos.x, localPos.y);
    var pos = stage.getPointerPosition();
    localPos = {
      x: pos.x - image.x(),
      y: pos.y - image.y()
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();

    lastPointerPosition = pos;
    drawLayer.batchDraw();
  });
}

// Setup sticker layer and canvas layer
function init(){
  stickerLayer = new Konva.Layer();
  stage.add(stickerLayer);
  isPaint = false;
  mode = 'brush';
  canvasSetting();
}
//----------------------------------------------------------------------
// Container event: Drag and drop sticker
{
  var con = stage.container();

  function drag(e){
    e.dataTransfer.setData("Text",e.target.id);
  }

  con.addEventListener('dragover', function(e) {
    e.preventDefault(); // !important
  });

  con.addEventListener('drop', function(e) {
    e.preventDefault();
    // now we need to find pointer position
    // we can't use stage.getPointerPosition() here, because that event
    // is not registered by Konva.Stage
    // we can register it manually:
    stage.setPointersPositions(e);
    // sticker name
    var name = e.dataTransfer.getData("Text");
    var img = new Image();
    img.onload=function(){
      drawImage(this, stage.getPointerPosition().x, stage.getPointerPosition().y);
    }
    img.src = name + ".png";
  });
}

//----------------------------------------------------------------------
// Sticker Touch event
var sticker = document.getElementById('border');
sticker.addEventListener('touchstart', function(e){
}, false);
sticker.addEventListener('touchmove', function(e){
}, false);
sticker.addEventListener('touchend', function(e){
  var x = e.changedTouches[0].clientX;
  var y = e.changedTouches[0].clientY;
  var img = new Image();
  var name = e.target.id;
  img.onload=function(){
    drawImage(this, x, y);
  }
  img.src = name + ".png";
}, false);
//----------------------------------------------------------------------
// Sticker function

function update(activeAnchor) {
  var group = activeAnchor.getParent();

  var topLeft = group.get('.topLeft')[0];
  var topRight = group.get('.topRight')[0];
  var bottomRight = group.get('.bottomRight')[0];
  var bottomLeft = group.get('.bottomLeft')[0];
  var image = group.get('Image')[0];

  var anchorX = activeAnchor.getX();
  var anchorY = activeAnchor.getY();

  // update anchor positions
  switch (activeAnchor.getName()) {
    case 'topLeft':
      topRight.y(anchorY);
      bottomLeft.x(anchorX);
      break;
    case 'topRight':
      topLeft.y(anchorY);
      bottomRight.x(anchorX);
      break;
    case 'bottomRight':
      bottomLeft.y(anchorY);
      topRight.x(anchorX);
      break;
    case 'bottomLeft':
      bottomRight.y(anchorY);
      topLeft.x(anchorX);
      break;
  }

  image.position(topLeft.position());

  var width = topRight.getX() - topLeft.getX();
  var height = bottomLeft.getY() - topLeft.getY();
  if (width && height) {
    image.width(width);
    image.height(height);
  }
}

function addAnchor(group, x, y, name) {
  var stage = group.getStage();
  // var layer = group.getLayer();

  var anchor = new Konva.Circle({
    x: x,
    y: y,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 2,
    radius: 8,
    name: name,
    draggable: true,
    dragOnTop: false
  });

  anchor.on('dragmove', function() {
    update(this);
    // layer.draw();
  });
  anchor.on('mousedown touchstart', function() {
    group.draggable(false);
    this.moveToTop();
  });
  anchor.on('dragend', function() {
    group.draggable(true);
    // layer.draw();
  });
  // add hover styling
  anchor.on('mouseover', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'pointer';
    this.strokeWidth(4);
    layer.draw();
  });
  anchor.on('mouseout', function() {
    var layer = this.getLayer();
    document.body.style.cursor = 'default';
    this.strokeWidth(2);
    layer.draw();
  });

  group.add(anchor);
}

// When sticker drops on the canvas, it will be called.
function drawImage(imageObj, x, y) {
  var width = imageObj.width * 0.1, height = imageObj.height * 0.1;
  var img = new Konva.Image({
    image: imageObj,
    width: width,
    height: height,
  });
  // add cursor styling
  img.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
  });
  img.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  var imgGroup = new Konva.Group({
    x: x,
    y: y,
    draggable: true
  });
  imgGroup.add(img);
  addAnchor(imgGroup, 0, 0, 'topLeft');
  addAnchor(imgGroup, width, 0, 'topRight');
  addAnchor(imgGroup, width, height, 'bottomRight');
  addAnchor(imgGroup, 0, height, 'bottomLeft');
  stickerLayer.add(imgGroup);
  stickerLayer.draw();
}

//----------------------------------------------------------------------
// Toolbox

// Brush color
document.querySelectorAll('nav a').forEach(link =>{
  link.addEventListener('click', function(event){
    mode = 'brush';
    context.strokeStyle = this.style.backgroundColor;

    context.globalCompositeOperation = "source-over";
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.lineCap = "round";
  })
})

//Clear Canvas Effect
function clearCanvas(){
  stage.destroyChildren();
  init();
}

// //Bursh Size Slider
// $("#brushSize").on('input', function(e){
//   var v = $(this).val();
//   context.lineWidth = v;
//   $('#val').html($(this).val());
//   $('#val').width(v).height(v);
// });

// Eraser
function erase(){
  mode = 'eraser';
}

//Submit Drawing
function submitDrawing (){
  window.location.href = 'commentGallery.html';
}

//Back to previous page
function backTo_id() {
  window.location.href = 'bookMap.html';
}


  
//新增
//Sticker Tool Bar
function stickerToolBar(){
  var x = document.getElementById('stickerToolBar');
  if (x.style.display === 'none'){
    x.style.display = 'block';
  }else{
    x.style.display = 'none';
  }
}
