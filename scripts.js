// variable declarations
var layers = {}
var totalLayers = 0;
var canvasHeightS = 1080;
var canvasWidthS = 1920;
var lWidth = 5;
var lastKeyPressed;
var shiftDown = false;
var ctrDown = false;
var mouseX = 0;
var mouseY = 0;
var RMB = false;
var OMX = 0;
var OMY = 0;
var COMX = 0
var COMY = 0
var OCPX = 0;
var OCPY = 0;
var invertScroll = true;
var toolbarToggle = 0;
var layerbarToggle = 0;
var mode = "draw";
var current = 0;
var zoom = 100;
var canvas;
var ctx = [];
var LMB = false;
var strokeSize = 3;
var paintCursor = document.getElementById("paintCursor");
var bgCanvas = document.getElementById("backgroundCanvas");
var lastCreated;
var temp = document.getElementById("tempCanvas");
var tctx = temp.getContext('2d');
var clickToggle;
var veryOMX;
var veryOMY;
var color = "#000000"
var saveCanvas = document.getElementById("SaveCanvas")


//layer system
function newLayer() {
  layers["layer" + totalLayers] = {};
  
	layers["layer" + totalLayers]["bitMap"] = document.createElement('canvas');
  layers["layer" + totalLayers]["bitMap"].id = "me"+totalLayers;
  layers["layer" + totalLayers]["bitMap"].classList.add("canvas");
  document.body.appendChild(layers["layer" + totalLayers]["bitMap"]);
  
  layers["layer" + totalLayers]["vector"] = document.createElement('canvas');
  layers["layer" + totalLayers]["vector"].id = "vectorL"+totalLayers;
  layers["layer" + totalLayers]["vector"].classList.add("canvas");
  document.body.appendChild(layers["layer" + totalLayers]["vector"]);
  
	layers["layer" + totalLayers]["preview"] = document.createElement('canvas');
  layers["layer" + totalLayers]["preview"].id = "previewId"+totalLayers;
  layers["layer" + totalLayers]["preview"].classList.add("previewCanvas");
  
  layers["layer" + totalLayers]["previewToolbar"] = document.createElement('canvas');
  layers["layer" + totalLayers]["previewToolbar"].id = "previewToolbar"+totalLayers;
  layers["layer" + totalLayers]["previewToolbar"].classList.add("previewToolbar");
  
  layers["layer" + totalLayers]["previewHide"] = document.createElement('div');
  layers["layer" + totalLayers]["previewHide"].id = "previewHide"+totalLayers;
  layers["layer" + totalLayers]["previewHide"].classList.add("material-symbols-outlined", "previewIcons");
  layers["layer" + totalLayers]["previewHide"].textContent = "visibility";
  layers["layer" + totalLayers]["previewHide"].onclick = function() {toggleVisibility(this.id.slice(11));}
  
  layers["layer" + totalLayers]["previewDuplicate"] = document.createElement('div');
  layers["layer" + totalLayers]["previewDuplicate"].id = "previewDuplicate"+totalLayers;
  layers["layer" + totalLayers]["previewDuplicate"].classList.add("material-symbols-outlined", "previewIcons");
  layers["layer" + totalLayers]["previewDuplicate"].textContent = "library_add";
  layers["layer" + totalLayers]["previewDuplicate"].onclick = function() {duplicateLayer(this.id.slice(16)); attemptLayerChange(parseInt((this.id.slice(16))) + 1); console.log(this.id.slice(16)); }
  
  layers["layer" + totalLayers]["previewDelete"] = document.createElement('span');
  layers["layer" + totalLayers]["previewDelete"].id = "previewDelete"+totalLayers;
  layers["layer" + totalLayers]["previewDelete"].classList.add("material-symbols-outlined", "previewIcons");
  layers["layer" + totalLayers]["previewDelete"].textContent = "delete";
  layers["layer" + totalLayers]["previewDelete"].onclick = function(){deleteLayer(this.id.slice(13));}
  
  layers["layer" + totalLayers]["previewContainer"] = document.createElement('span');
  layers["layer" + totalLayers]["previewContainer"].id = "previewContainerId"+totalLayers;
  layers["layer" + totalLayers]["previewContainer"].classList.add("previewContainer");
  layers["layer" + totalLayers]["previewContainer"].onmousedown = function() {attemptLayerChange(this.id.slice(18))}
  
  document.getElementById("layerbar").appendChild(layers["layer" + totalLayers]["previewContainer"]);
  layers["layer" + totalLayers]["previewContainer"].appendChild(layers["layer" + totalLayers]["preview"]);
  layers["layer" + totalLayers]["previewContainer"].appendChild(layers["layer" + totalLayers]["previewHide"]);
  layers["layer" + totalLayers]["previewContainer"].appendChild(layers["layer" + totalLayers]["previewDelete"]);
  layers["layer" + totalLayers]["previewContainer"].appendChild(layers["layer" + totalLayers]["previewDuplicate"]);
  
  
  current = totalLayers;
  totalLayers=totalLayers+1;
  
  
  initializeCanvas();

  /* 
Object.values(layers).forEach((layer) => { 

}); 
*/ 
}
newLayer();

function toggleVisibility (layerName) {
  
if (layers["layer" + layerName]["previewHide"].textContent != "visibility_off") {
  var currentB4 = current
  layers["layer" + layerName]["previewHide"].textContent = "visibility_off";
  layers["layer" + layerName]["bitMap"].style.display = "none";
  layers["layer" + layerName]["preview"].style.backgroundColor = "#ffffffaa"
} else {
  layers["layer" + layerName]["previewHide"].textContent = "visibility";
  layers["layer" + layerName]["bitMap"].style.display = "block";
  layers["layer" + layerName]["preview"].style.backgroundColor = "#ffffff"
  current = currentB4;
  layerChange();
}
}

function deleteLayer (layerName) {
 /* 
  if (document.getElementById("me"+(parseInt(current)+1)) != null) {
    current = totalLayers;
  document.body.removeChild(layers["layer" + layerName]["bitMap"]);
  document.getElementById("layerbar").removeChild(layers["layer" + layerName]["previewContainer"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["preview"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["previewDelete"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["previewHide"]);
    current = parseInt(totalLayers)+1; layerChange();
    totalLayers = parseInt(totalLayers) - 1;
  } else {
    if (document.getElementById("me"+(parseInt(current)-1)) != null) {
      current = totalLayers;
  document.body.removeChild(layers["layer" + layerName]["bitMap"]);
  document.getElementById("layerbar").removeChild(layers["layer" + layerName]["previewContainer"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["preview"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["previewDelete"]);
  layers["layer" + layerName]["previewContainer"].removeChild(layers["layer" + layerName]["previewHide"]);
    current = parseInt(totalLayers)-1; layerChange();
    totalLayers = parseInt(totalLayers) - 1
  }
  }
  
  */
  
  ctx["me"+layerName].clearRect(0,0,canvas.width,canvas.height)
  
  layers["layer" + layerName]["bitMap"].style.display = "none";
  layers["layer" + layerName]["previewContainer"].style.display = "none";
  layers["layer" + layerName]["preview"].style.display = "none";
  layers["layer" + layerName]["previewDelete"].style.display = "none";
  layers["layer" + layerName]["previewHide"].style.display = "none";
  layers["layer" + layerName]["previewDuplicate"].style.display = "none";
  layers["layer" + layerName]["vector"].style.display= "none";
  
} 

function duplicateLayer (layerName) {
  newLayer();
document.getElementById("me"+current).getContext("2d").drawImage(document.getElementById("me"+layerName),0,0,document.getElementById("me"+current).width,canvasHeightS/canvasWidthS*document.getElementById("me"+current).width)
}

function attemptLayerChange(layerName) {
  console.log(layerName)
  if (layers["layer" + layerName]["previewHide"].textContent != "visibility_off") {
  current = layerName;
  layerChange();
  } else {
    //alert("You can't edit a hidden layer.")
  }
}

document.getElementById("me0").style.left = canvasWidthS*-0.25+"px"

function initializeCanvas() {
  canvas = document.getElementById("me"+(totalLayers-1));
  Object.values(layers).forEach((layer) => {
    if (document.getElementById(layer.bitMap.id) != null) {ctx[layer.bitMap.id] = canvas.getContext("2d");
  canvas.style.left = "px";
  canvas.style.top = "0px";
  canvas.width = canvasWidthS;
  canvas.height = canvasHeightS;
  ctx[layer.bitMap.id].lineCap = "round";
  canvas.style.transform = `scale(${(zoom)/250})`;
    if (parseInt((layer.bitMap.id).slice(2)-1) != -1) {
      document.getElementById(layer.bitMap.id).style.left = document.getElementById("me"+parseInt((layer.bitMap.id).slice(2)-1)).style.left
  document.getElementById(layer.bitMap.id).style.top = document.getElementById("me"+parseInt((layer.bitMap.id).slice(2)-1)).style.top
    }}
  
  }); 
 document.getElementById("previewId"+current).height = canvasHeightS/canvasWidthS*document.getElementById("previewId"+current).width

  
}

function layerChange () {
  canvas = document.getElementById("me"+(current));
  ctx["me"+current] = canvas.getContext("2d");
  
}


// Toggle sidebar
function toggleSidebar(id) {
  const sidebar = document.getElementById(id);
  if (sidebar.style.transform === "translateX(0px)" || sidebar.style.transform === "") {
    if (id === "toolbar") {
      toolbarToggle = 1;
      sidebar.style.transform = "translateX(-100%)";
      document.getElementById("toggle-toolbar-btn").style.left = "0";
      document.getElementById("toolbarArrow").style.transform = "rotate(180deg)"
      document.getElementById("topbar").style.left = "0";
      if (layerbarToggle == 0) {
        document.getElementById("topbar").style.width = (window.innerWidth * 0.8) + "px";
      } else {
        document.getElementById("topbar").style.width = (window.innerWidth) + "px";
      }
    } else if (id === "layerbar") {
      layerbarToggle = 1;
      sidebar.style.transform = "translateX(100%)";
      document.getElementById("toggle-layerbar-btn").style.right = "0";
      document.getElementById("layerbarArrow").style.transform = "rotate(0deg)"
      if (toolbarToggle == 0) {
        document.getElementById("topbar").style.width = (window.innerWidth * 0.95) + "px";
      } else {
        document.getElementById("topbar").style.width = (window.innerWidth) + "px";
      }
    }
  } else {
    sidebar.style.transform = "translateX(0)";
    if (id === "toolbar") {
      toolbarToggle = 0;
      document.getElementById("toggle-toolbar-btn").style.left = "5%";
      document.getElementById("toolbarArrow").style.transform = "rotate(0deg)"
      document.getElementById("topbar").style.left = "5%";
      if (layerbarToggle == 0) {
        document.getElementById("topbar").style.width = (window.innerWidth * 0.75) + "px";
      } else {
        document.getElementById("topbar").style.width = (window.innerWidth) + "px";
      }
    }
    if (id === "layerbar") {
      layerbarToggle = 0;
      document.getElementById("toggle-layerbar-btn").style.right = "20%";
      document.getElementById("layerbarArrow").style.transform = "rotate(180deg)"
      if (toolbarToggle == 0) {
        document.getElementById("topbar").style.width = (window.innerWidth * 0.75) + "px";
      } else {
        document.getElementById("topbar").style.width = (window.innerWidth * 0.8) + "px";
      }
    }
  }
}



// event listeners
document.addEventListener("keydown", logKey);
document.addEventListener("keyup", onKeyUp);

function logKey(e) {
  lastKeyPressed = e.code;
  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    shiftDown = true;
  }
  if (e.code === "ControlLeft" || e.code === "ControlRight") {
    ctrDown = true;
  }
  
  if (e.code === "KeyQ") {
    alert(document.getElementById("me0").style.left+"   "+document.getElementById("me0").style.top+"  window:  "+window.innerWidth+"   "+window.innerHeight)
  }
  console.log(lastKeyPressed);
}

function onKeyUp() {
  shiftDown = false;
  ctrDown = false;
}

// canvas handling
function myFunction(event) {
  if (layerbarToggle == 1 || mouseX < window.innerWidth-document.getElementById("layerbar").getBoundingClientRect().width) {  
    var scrollEvent = invertScroll ? - event.deltaY : event.deltaY;

  zoom = Math.max(10, Math.min(zoom + (scrollEvent / 4), 1000));
  console.log(zoom);

  Object.values(layers).forEach((layer) => { 
    if (document.getElementById(layer.bitMap.id) != null) {document.getElementById(layer.bitMap.id).style.transform = `scale(${(zoom)/250})`;
bgCanvas.style.transform = `scale(${(zoom)/250})`; temp.style.transform = `scale(${(zoom)/250})`;}

}); 
  
  paintCursor.style.transform = `translate(${mouseX-5}px, ${mouseY-5}px) scale(${strokeSize/15*zoom/100})`;}

}
var lineToggle;
function onMouseDown(e) {
	if (e.which === 1) {
  OMY = mouseY;
  OMX = mouseX;
  if (layerbarToggle == 1 || mouseX < window.innerWidth-document.getElementById("layerbar").getBoundingClientRect().width && mouseY > document.getElementById("topbar").getBoundingClientRect().height) {
  LMB = true;}
    
  tctx.moveTo( (veryOMX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (veryOMY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
    
  }
  if (e.which === 3 || e.button === 1) {
    COMY = mouseY;
    COMX = mouseX;
    Object.values(layers).forEach((layer) => { 
    if (document.getElementById(layer.bitMap.id) != null) {OCPX = parseInt(document.getElementById(layer.bitMap.id).style.left.slice(0, -2));
    OCPY = parseInt(document.getElementById(layer.bitMap.id).style.top.slice(0, -2));} 
    
}); 
    if (layerbarToggle == 1 || mouseX < window.innerWidth-document.getElementById("layerbar").getBoundingClientRect().width) {
    RMB = true;}
  }
  
}

function onMouseUp() {
  RMB = false;
  LMB = false;
  clickToggle = false;
  
}

function onMouseMove(e) {
  window.scrollTo(0, 0);
  paintCursor.style.transform = `translate(${mouseX-5}px, ${mouseY-5}px) scale(${strokeSize/15*zoom/100})`;
  if(LMB){
    ctx["me"+current].lineWidth = strokeSize;
    ctx["me"+current].strokeStyle = color;
  }
  if(LMB == true /*|| LMB == false*/) {
    if(clickToggle == false){
      veryOMX = mouseX;
      veryOMY = mouseY;
      clickToggle = true;
    }
  }
  
  if (LMB == true && (mode == "draw" || mode == "erase")) {
    if (mode == "draw") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {ctx[layer.bitMap.id].globalCompositeOperation = "source-over" }

});   
    }
    if (mode == "erase") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {ctx[layer.bitMap.id].globalCompositeOperation = "destination-out"}
});       
    }
    
    //checked /\
    ctx["me"+current].beginPath();
    ctx["me"+current].moveTo((OMX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (OMY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
    ctx["me"+current].lineTo( (mouseX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (mouseY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
    ctx["me"+current].stroke();
    

    OMY = mouseY;
    OMX = mouseX;
  } else {
    
    if (mode == "line") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {ctx[layer.bitMap.id].globalCompositeOperation = "source-over" }
        if (LMB){
          temp.style.display = "block";
        tctx.lineWidth = strokeSize;
        tctx.strokeStyle = color;
        tctx.lineCap = "round";
        tctx.clearRect(0,0,temp.width,temp.height);
        tctx.moveTo( (veryOMX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (veryOMY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
        tctx.lineTo( (mouseX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (mouseY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
        tctx.stroke();
        tctx.beginPath();
        lineToggle = true;
        }
        
        if (!LMB && lineToggle) {ctx["me"+current].lineWidth = strokeSize;
        ctx["me"+current].beginPath();
        ctx["me"+current].moveTo( (veryOMX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (veryOMY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
        ctx["me"+current].lineTo( (mouseX - canvas.getBoundingClientRect().left) / parseFloat(canvas.style.transform.slice(6, -1)), (mouseY - canvas.getBoundingClientRect().top) / parseFloat(canvas.style.transform.slice(6, -1)));
        ctx["me"+current].stroke();
        lineToggle = false;}
        
        if(!LMB){
          temp.style.display = "none"
        }
        
        
        
});   
    }
    
  }
  mouseX = e.x;
  mouseY = e.y;
  if (RMB) {
    Object.values(layers).forEach((layer) => {
      if (document.getElementById(layer.bitMap.id) != null) {document.getElementById(layer.bitMap.id).style.left = (mouseX - COMX + OCPX) + "px";
    document.getElementById(layer.bitMap.id).style.top = (mouseY - COMY + OCPY) + "px";
    bgCanvas.style.left = (mouseX - COMX + OCPX) + "px";
    bgCanvas.style.top = (mouseY - COMY + OCPY) + "px";
    temp.style.left = (mouseX - COMX + OCPX) + "px";
    temp.style.top = (mouseY - COMY + OCPY) + "px";}
    
    
}); 
    
  }
  document.getElementById("previewId"+current).getContext("2d").clearRect(0,0,document.getElementById("previewId"+current).width,document.getElementById("previewId"+current).height)
  document.getElementById("previewId"+current).getContext("2d").drawImage(document.getElementById("me"+current),0,0,document.getElementById("previewId"+current).width,canvasHeightS/canvasWidthS*document.getElementById("previewId"+current).width)
}

document.addEventListener("contextmenu", (e) => e?.cancelable && e.preventDefault());
addEventListener("mousedown", onMouseDown);
addEventListener("mouseup", onMouseUp);
addEventListener("mousemove", onMouseMove);

//final init and outsider functions
  document.getElementById("me0").style.transform = `scale(${(zoom)/250})`;

  var canvas = document.getElementById("me0");
  ctx["me0"].lineWidth = 1;
  ctx["me0"].moveTo(0, 0);
  ctx["me0"].lineTo(100, 100);
  ctx["me0"].stroke();
  ctx["me0"].lineCap = "round";
 
function clearDraw () {
  ctx["me"+current].clearRect(0,0,canvas.width,canvas.height)
  document.getElementById("previewId"+current).getContext("2d").clearRect(0,0,document.getElementById("previewId"+current).width,document.getElementById("previewId"+current).height)
}
function changeColor(newColor) {
  color = newColor
}

function downloadCanvas() {
  saveCanvas.getContext('2d').clearRect(0,0,saveCanvas.width,saveCanvas.height)
  Object.values(layers).forEach((layer) => {
    saveCanvas.getContext('2d').drawImage(document.getElementById(layer.bitMap.id), 0, 0)
  });
  const link = document.createElement('a');
  link.href = saveCanvas.toDataURL('image/png');
  link.download = document.getElementById("pictureName").value+'.png';
  link.click();
}

function imageData () {
  saveCanvas.getContext('2d').clearRect(0,0,saveCanvas.width,saveCanvas.height)
  Object.values(layers).forEach((layer) => {
    saveCanvas.getContext('2d').drawImage(document.getElementById(layer.bitMap.id), 0, 0)
  });
  console.log(saveCanvas.getContext('2d').createImageData(saveCanvas.width,saveCanvas.height).data)
}

document.getElementById("myRange").oninput = function () {
  strokeSize = document.getElementById("myRange").value;
}
bgCanvas.width = canvasWidthS;
bgCanvas.height = canvasHeightS;
bgCanvas.style.transform = `scale(${(zoom)/250})`;
temp.width = canvasWidthS;
temp.height = canvasHeightS;
saveCanvas.width = canvasWidthS;
saveCanvas.height = canvasHeightS;
temp.style.transform = `scale(${(zoom)/250})`;
//document.getElementById(layers["layer0"].bitMap.id).style.top = "700px";
document.getElementById("layerbarArrow").style.transform = "rotate(180deg)";
document.getElementById("topbar").style.width = (window.innerWidth * 0.75) + "px";


layers["layer0"]["bitMap"].style.left = window.innerWidth/2+(layers["layer0"]["bitMap"].getBoundingClientRect().width/2);
layers["layer0"]["bitMap"].style.top = "0";
bgCanvas.style.left = window.innerWidth/2-(layers["layer0"]["bitMap"].getBoundingClientRect().width)-300;
bgCanvas.style.top = "0";
temp.style.left = window.innerWidth/2+(layers["layer0"]["bitMap"].getBoundingClientRect().width/2)-700;
temp.style.top = "0";

document.getElementById("me0").style.left = bgCanvas.style.left;
document.getElementById("me0").style.top = 0;
document.getElementById("tempCanvas").style.left = bgCanvas.style.left;
document.getElementById("tempCanvas").style.top = 0;