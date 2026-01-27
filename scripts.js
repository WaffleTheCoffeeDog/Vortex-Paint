// variable declarations
var layers = {};
var totalLayers = 0;
realTotalLayers = 0;
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
var COMX = 0;
var COMY = 0;
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
var relativeStrokeSize = strokeSize;
var paintCursor = document.getElementById("paintCursor");
var bgCanvas = document.getElementById("backgroundCanvas");
var lastCreated;
var temp = document.getElementById("tempCanvas");
var tctx = temp.getContext("2d", { willReadFrequently: true });
var clickToggle;
var veryOMX;
var veryOMY;
var color = "#000000";
var saveCanvas = document.getElementById("SaveCanvas");
var undoStack = [];
var undoStackIndex = [];
var redoStack = [];
var redoStackIndex = [];
var newlayer;

//layer system
function newLayer() {
  newlayer = true;
  layers["layer" + totalLayers] = {};

  layers["layer" + totalLayers]["bitMap"] = document.createElement("canvas");
  layers["layer" + totalLayers]["bitMap"].id = "me" + totalLayers;
  layers["layer" + totalLayers]["bitMap"].classList.add("canvas");
  document
    .getElementById("canvasContainer")
    .prepend(layers["layer" + totalLayers]["bitMap"]);

  layers["layer" + totalLayers]["vector"] = document.createElement("canvas");
  layers["layer" + totalLayers]["vector"].id = "vectorL" + totalLayers;
  layers["layer" + totalLayers]["vector"].classList.add("canvas");
  document.body.prepend(layers["layer" + totalLayers]["vector"]);

  layers["layer" + totalLayers]["preview"] = document.createElement("canvas");
  layers["layer" + totalLayers]["preview"].id = "previewId" + totalLayers;
  layers["layer" + totalLayers]["preview"].classList.add("previewCanvas");

  layers["layer" + totalLayers]["previewToolbar"] =
    document.createElement("canvas");
  layers["layer" + totalLayers]["previewToolbar"].id =
    "previewToolbar" + totalLayers;
  layers["layer" + totalLayers]["previewToolbar"].classList.add(
    "previewToolbar"
  );

  layers["layer" + totalLayers]["previewHide"] = document.createElement("div");
  layers["layer" + totalLayers]["previewHide"].id = "previewHide" + totalLayers;
  layers["layer" + totalLayers]["previewHide"].classList.add(
    "material-symbols-outlined",
    "previewIcons"
  );
  layers["layer" + totalLayers]["previewHide"].textContent = "visibility";
  layers["layer" + totalLayers]["previewHide"].onclick = function () {
    toggleVisibility(this.id.slice(11));
  };

  layers["layer" + totalLayers]["previewDuplicate"] =
    document.createElement("div");
  layers["layer" + totalLayers]["previewDuplicate"].id =
    "previewDuplicate" + totalLayers;
  layers["layer" + totalLayers]["previewDuplicate"].classList.add(
    "material-symbols-outlined",
    "previewIcons"
  );
  layers["layer" + totalLayers]["previewDuplicate"].textContent = "library_add";
  layers["layer" + totalLayers]["previewDuplicate"].onclick = function () {
    duplicateLayer(this.id.slice(16));
    attemptLayerChange(
      document.getElementsByClassName("previewContainer").length - 1
    );
  };

  layers["layer" + totalLayers]["previewDelete"] =
    document.createElement("span");
  layers["layer" + totalLayers]["previewDelete"].id =
    "previewDelete" + totalLayers;
  layers["layer" + totalLayers]["previewDelete"].classList.add(
    "material-symbols-outlined",
    "previewIcons"
  );
  layers["layer" + totalLayers]["previewDelete"].textContent = "delete";
  layers["layer" + totalLayers]["previewDelete"].onclick = function () {
    deleteLayer(this.id.slice(13));
  };

  layers["layer" + totalLayers]["previewDown"] = document.createElement("span");
  layers["layer" + totalLayers]["previewDown"].id = "previewDown" + totalLayers;
  layers["layer" + totalLayers]["previewDown"].classList.add(
    "material-symbols-outlined",
    "previewIcons",
    "previewSmol"
  );
  layers["layer" + totalLayers]["previewDown"].textContent =
    "keyboard_arrow_down";
  layers["layer" + totalLayers]["previewDown"].onclick = function () {
    moveDown(this.id.slice(11));
  };

  layers["layer" + totalLayers]["previewUp"] = document.createElement("span");
  layers["layer" + totalLayers]["previewUp"].id = "previewUp" + totalLayers;
  layers["layer" + totalLayers]["previewUp"].classList.add(
    "material-symbols-outlined",
    "previewIcons",
    "previewSmol"
  );
  layers["layer" + totalLayers]["previewUp"].textContent = "keyboard_arrow_up";
  layers["layer" + totalLayers]["previewUp"].onclick = function () {
    moveUp(this.id.slice(9));
  };

  layers["layer" + totalLayers]["previewContainer"] =
    document.createElement("span");
  layers["layer" + totalLayers]["previewContainer"].id =
    "previewContainerId" + totalLayers;
  layers["layer" + totalLayers]["previewContainer"].classList.add(
    "previewContainer"
  );
  //layers["layer" + totalLayers]["previewContainer"].draggable = true;
  layers["layer" + totalLayers]["previewContainer"].onmousedown = function () {
    attemptLayerChange(this.id.slice(18));
  };

  document
    .getElementById("previewContainerButActuallyRealThisTimeIPromise")
    .prepend(layers["layer" + totalLayers]["previewContainer"]);
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["preview"]
  );
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["previewHide"]
  );
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["previewDelete"]
  );
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["previewDuplicate"]
  );
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["previewDown"]
  );
  layers["layer" + totalLayers]["previewContainer"].appendChild(
    layers["layer" + totalLayers]["previewUp"]
  );
  document
    .getElementById("previewContainerId" + current)
    .classList.remove("selectedLayer");
  current = totalLayers;
  realTotalLayers = realTotalLayers + 1;
  totalLayers = totalLayers + 1;
  document
    .getElementById("previewContainerId" + current)
    .classList.add("selectedLayer");
  initializeCanvas();

  /* 
Object.values(layers).forEach((layer) => { 

}); 
*/
}
newLayer();

function toggleVisibility(layerName) {
  if (
    layers["layer" + layerName]["previewHide"].textContent != "visibility_off"
  ) {
    var currentB4 = current;
    layers["layer" + layerName]["previewHide"].textContent = "visibility_off";
    layers["layer" + layerName]["bitMap"].style.display = "none";
    layers["layer" + layerName]["preview"].style.backgroundColor = "#ffffffaa";
  } else {
    layers["layer" + layerName]["previewHide"].textContent = "visibility";
    layers["layer" + layerName]["bitMap"].style.display = "block";
    layers["layer" + layerName]["preview"].style.backgroundColor = "#ffffff";
    current = currentB4;
    layerChange();
  }
}

function deleteLayer(layerName) {
  if (realTotalLayers > 1) {
    ctx["me" + layerName].clearRect(0, 0, canvas.width, canvas.height);

    layers["layer" + layerName]["bitMap"].style.display = "none";
    layers["layer" + layerName]["previewContainer"].style.display = "none";
    layers["layer" + layerName]["preview"].style.display = "none";
    layers["layer" + layerName]["previewDelete"].style.display = "none";
    layers["layer" + layerName]["previewHide"].style.display = "none";
    layers["layer" + layerName]["previewDuplicate"].style.display = "none";
    layers["layer" + layerName]["vector"].style.display = "none";

    realTotalLayers = realTotalLayers - 1;

    current = null;
  }
}

function duplicateLayer(layerName) {
  newLayer();
  document
    .getElementById("me" + current)
    .getContext("2d", { willReadFrequently: true })
    .drawImage(
      document.getElementById("me" + layerName),
      0,
      0,
      document.getElementById("me" + current).width,
      (canvasHeightS / canvasWidthS) *
        document.getElementById("me" + current).width
    );
}

function attemptLayerChange(layerName) {
  if (
    layers["layer" + layerName]["previewHide"].textContent != "visibility_off"
  ) {
    if (current) {
      document
        .getElementById("previewContainerId" + current)
        .classList.remove("selectedLayer");
    }
    current = layerName;
    layerChange();
  } else {
    //alert("You can't edit a hidden layer.")
  }
}

document.getElementById("me0").style.left = canvasWidthS * -0.25 + "px";

function initializeCanvas() {
  undoStack[current] = [];
  undoStackIndex[current] = [0];
  redoStack[current] = [];
  redoStackIndex[current] = [0];
  canvas = document.getElementById("me" + (totalLayers - 1));
  Object.values(layers).forEach((layer) => {
    if (document.getElementById(layer.bitMap.id) != null) {
      // ensure contexts are created with willReadFrequently for canvases we read often
      ctx[layer.bitMap.id] = canvas.getContext("2d", { willReadFrequently: true });
      canvas.style.left = "px";
      canvas.style.top = "0px";
      canvas.width = canvasWidthS;
      canvas.height = canvasHeightS;
      ctx[layer.bitMap.id].lineCap = "round";
      canvas.style.transform = `scale(${zoom / 250})`;
      if (parseInt(layer.bitMap.id.slice(2) - 1) != -1) {
        document.getElementById(layer.bitMap.id).style.left =
          document.getElementById(
            "me" + parseInt(layer.bitMap.id.slice(2) - 1)
          ).style.left;
        document.getElementById(layer.bitMap.id).style.top =
          document.getElementById(
            "me" + parseInt(layer.bitMap.id.slice(2) - 1)
          ).style.top;
      }
    }
  });
  document.getElementById("previewId" + current).height =
    (canvasHeightS / canvasWidthS) *
    document.getElementById("previewId" + current).width;
  for (let i = 0; i < 1000; i++) {
    moveDown(totalLayers);
  }
  undoStack[current].push(
    layers["layer" + current].bitMap
      .getContext("2d", { willReadFrequently: true })
      .getImageData(0, 0, canvas.width, canvas.height)
  );
}

function layerChange() {
  canvas = document.getElementById("me" + current);
  ctx["me" + current] = canvas.getContext("2d", { willReadFrequently: true });
  document
    .getElementById("previewContainerId" + current)
    .classList.add("selectedLayer");
}

function toggleSidebar(id) {
  const sidebar = document.getElementById(id);
  if (
    sidebar.style.transform === "translateX(0px)" ||
    sidebar.style.transform === ""
  ) {
    if (id === "toolbar") {
      toolbarToggle = 1;
      sidebar.style.transform = "translateX(-100%)";
      document.getElementById("toggle-toolbar-btn").style.left = "0";
      document.getElementById("toolbarArrow").style.transform =
        "rotate(180deg)";

    } else if (id === "layerbar") {
      layerbarToggle = 1;
      sidebar.style.transform = "translateX(100%)";
      document.getElementById("toggle-layerbar-btn").style.right = "0";
      document.getElementById("layerbarArrow").style.transform = "rotate(0deg)";
      if (toolbarToggle == 0) {
    }}
  } else {
    sidebar.style.transform = "translateX(0)";
    if (id === "toolbar") {
      toolbarToggle = 0;
      document.getElementById("toggle-toolbar-btn").style.left = "5%";
      document.getElementById("toolbarArrow").style.transform = "rotate(0deg)";
      document.getElementById("topbar").style.left = "5%";
      if (layerbarToggle == 0) {
        document.getElementById("topbar").style.width =
          window.innerWidth * 0.75 + "px";
      } else {
        document.getElementById("topbar").style.width =
          window.innerWidth + "px";
      }
    }
    if (id === "layerbar") {
      layerbarToggle = 0;
      document.getElementById("toggle-layerbar-btn").style.right = "20%";
      document.getElementById("layerbarArrow").style.transform =
        "rotate(180deg)";
      if (toolbarToggle == 0) {
        document.getElementById("topbar").style.width =
          window.innerWidth * 0.75 + "px";
      } else {
        document.getElementById("topbar").style.width =
          window.innerWidth * 0.8 + "px";
      }
    }
  }
}

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
  if (e.code === "KeyZ") {
    if (undoStackIndex[current] > 0) {
      undoStackIndex[current]--;
      ctx["me" + current].clearRect(0, 0, canvas.width, canvas.height);
      if (undoStack[current][undoStackIndex[current]]) {
        redoStack[current].push(
          undoStack[current].splice(undoStackIndex[current] + 1)[0]
        );
        ctx["me" + current].putImageData(
          undoStack[current][undoStackIndex[current]],
          0,
          0
        );
      }
    }
    drawPreview();
  }

  if (e.code === "KeyY") {
    if (redoStack[current].length > 0) {
      ctx["me" + current].clearRect(0, 0, canvas.width, canvas.height);
      const redoAction = redoStack[current].pop();
      undoStack[current].splice(undoStackIndex[current] + 1, 0, redoAction);
      undoStackIndex[current]++;
      ctx["me" + current].putImageData(redoAction, 0, 0);
    }
    drawPreview();
  }
  console.log(lastKeyPressed);
}

function onKeyUp() {
  shiftDown = false;
  ctrDown = false;
}

// canvas handling
function myFunction(event) {
  if (document.getElementById("settings").style.display == "none") {
    if (
      layerbarToggle == 1 ||
      mouseX <
        window.innerWidth -
          document.getElementById("layerbar").getBoundingClientRect().width
    ) {
      var scrollEvent = invertScroll ? -event.deltaY : event.deltaY;

      zoom = Math.max(10, Math.min(zoom + scrollEvent / 4, 1000));
      console.log(zoom);

      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          document.getElementById(layer.bitMap.id).style.transform = `scale(${
            zoom / 250
          })`;
          bgCanvas.style.transform = `scale(${zoom / 250})`;
          temp.style.transform = `scale(${zoom / 250})`;
        }
      });

      paintCursor.style.transform = `translate(${mouseX - 5}px, ${
        mouseY - 5
      }px) scale(${((relativeStrokeSize / 15) * zoom) / 100})`;
    }
  }
}
var lineToggle;
function onMouseDown(e) {
  if (e.which === 1) {
    OMY = mouseY;
    OMX = mouseX;
    if (
      layerbarToggle == 1 ||
      (mouseX <
        window.innerWidth -
          document.getElementById("layerbar").getBoundingClientRect().width &&
        mouseY >
          document.getElementById("topbar").getBoundingClientRect().height)
    ) {
      LMB = true;

      if (window.triangleSecondX && mode == "triangle") {
        ctx["me" + current].beginPath();
        ctx["me" + current].moveTo(
          window.triangleStartX,
          window.triangleStartY
        );
        ctx["me" + current].lineTo(
          window.triangleSecondX,
          window.triangleSecondY
        );
        ctx["me" + current].lineTo(
          (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1)),
          (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1))
        );
        ctx["me" + current].closePath();
        ctx["me" + current].stroke();

        setTimeout(() => {
          window.completingTriangle = false;
          window.triangleStartX = undefined;
          window.triangleSecondX = undefined;
          temp.style.display = "none";
          LMB = false;
        }, 10);
      }

      if (!!window.arcSecondX && mode == "arc") {
        ctx["me" + current].beginPath();
        ctx["me" + current].moveTo(window.arcStartX, window.arcStartY);
        ctx["me" + current].quadraticCurveTo(
          (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1)) -
            (window.arcStartX + window.arcSecondX) / 2 +
            (mouseX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),

          (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1)) -
            (window.arcStartY + window.arcSecondY) / 2 +
            (mouseY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1)),
          window.arcSecondX,
          window.arcSecondY
        );
        ctx["me" + current].stroke();

        setTimeout(() => {
          window.completingArc = false;
          window.arcStartX = undefined;
          window.arcSecondX = undefined;
          temp.style.display = "none";
          LMB = false;
        }, 10);
      }
    }

    tctx.moveTo(
      (veryOMX - canvas.getBoundingClientRect().left) /
        parseFloat(canvas.style.transform.slice(6, -1)),
      (veryOMY - canvas.getBoundingClientRect().top) /
        parseFloat(canvas.style.transform.slice(6, -1))
    );
  }
  if (e.which === 3 || e.button === 1) {
    COMY = mouseY;
    COMX = mouseX;
    Object.values(layers).forEach((layer) => {
      if (document.getElementById(layer.bitMap.id) != null) {
        OCPX = parseInt(
          document.getElementById(layer.bitMap.id).style.left.slice(0, -2)
        );
        OCPY = parseInt(
          document.getElementById(layer.bitMap.id).style.top.slice(0, -2)
        );
      }
    });
    if (
      layerbarToggle == 1 ||
      mouseX <
        window.innerWidth -
          document.getElementById("layerbar").getBoundingClientRect().width
    ) {
      RMB = true;
    }
  }
}

function onMouseUp() {
  if (LMB) {
    /*if(!newlayer) {*/ undoStackIndex[current]++;
    undoStack[current].push(
      layers["layer" + current].bitMap
        .getContext("2d", { willReadFrequently: true })
        .getImageData(0, 0, canvas.width, canvas.height)
    );
    redoStack[current] = [];
    redoStackIndex[current] = 0;
  } else {
    newlayer = false;
  }
  /*}*/

  RMB = false;
  LMB = false;
  clickToggle = false;
}

function drawFunct(e) {
  window.scrollTo(0, 0);
  paintCursor.style.transform = `translate(${mouseX - 5}px, ${
    mouseY - 5
  }px) scale(${((relativeStrokeSize / 15) * zoom) / 100})`;
  if (LMB) {
    ctx["me" + current].lineWidth = relativeStrokeSize;
    ctx["me" + current].strokeStyle = color;
  }
  if (LMB == true) {
    if (clickToggle == false) {
      veryOMX = mouseX;
      veryOMY = mouseY;
      clickToggle = true;
    }
  }

  if (LMB == true && (mode == "draw" || mode == "erase")) {
    if (mode == "draw") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }
      });
    }
    if (mode == "erase") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "destination-out";
        }
      });
    }

    ctx["me" + current].beginPath();
    ctx["me" + current].moveTo(
      (OMX - canvas.getBoundingClientRect().left) /
        parseFloat(canvas.style.transform.slice(6, -1)),
      (OMY - canvas.getBoundingClientRect().top) /
        parseFloat(canvas.style.transform.slice(6, -1))
    );
    ctx["me" + current].lineTo(
      (mouseX - canvas.getBoundingClientRect().left) /
        parseFloat(canvas.style.transform.slice(6, -1)),
      (mouseY - canvas.getBoundingClientRect().top) /
        parseFloat(canvas.style.transform.slice(6, -1))
    );
    ctx["me" + current].stroke();

    OMY = mouseY;
    OMX = mouseX;
  } else {
    if (mode == "line") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }
        if (LMB) {
          temp.style.display = "block";
          tctx.lineWidth = relativeStrokeSize;
          tctx.strokeStyle = color;
          tctx.lineCap = "round";
          tctx.clearRect(0, 0, temp.width, temp.height);
          tctx.moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          tctx.lineTo(
            (mouseX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          tctx.stroke();
          tctx.beginPath();
          lineToggle = true;
        }

        if (!LMB && lineToggle) {
          ctx["me" + current].lineWidth = relativeStrokeSize;
          ctx["me" + current].beginPath();
          ctx["me" + current].moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          ctx["me" + current].lineTo(
            (mouseX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          ctx["me" + current].stroke();
          lineToggle = false;
        }

        if (!LMB) {
          temp.style.display = "none";
        }
      });
    }

    if (mode == "circle") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }
        if (LMB) {
          temp.style.display = "block";
          tctx.lineWidth = relativeStrokeSize;
          tctx.strokeStyle = color;
          tctx.lineCap = "round";
          tctx.clearRect(0, 0, temp.width, temp.height);
          tctx.moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          tctx.beginPath();
          tctx.arc(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (Math.sqrt(Math.pow(OMX - mouseX, 2) + Math.pow(OMY - mouseY, 2)) /
              zoom) *
              250,
            0,
            360
          );
          tctx.stroke();
          lineToggle = true;
        }

        if (!LMB && lineToggle) {
          ctx["me" + current].lineWidth = relativeStrokeSize;
          ctx["me" + current].moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          ctx["me" + current].beginPath();
          ctx["me" + current].arc(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (Math.sqrt(Math.pow(OMX - mouseX, 2) + Math.pow(OMY - mouseY, 2)) /
              zoom) *
              250,
            0,
            360
          );
          ctx["me" + current].stroke();
          lineToggle = false;
        }

        if (!LMB) {
          temp.style.display = "none";
        }
      });
    }

    if (mode == "rectangle") {
      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }
        if (LMB) {
          temp.style.display = "block";
          tctx.lineWidth = relativeStrokeSize;
          tctx.strokeStyle = color;
          tctx.lineCap = "round";
          tctx.clearRect(0, 0, temp.width, temp.height);
          tctx.moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          tctx.rect(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseX - OMX) / parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseY - OMY) / parseFloat(canvas.style.transform.slice(6, -1))
          );
          tctx.stroke();
          tctx.beginPath();
          lineToggle = true;
        }

        if (!LMB && lineToggle) {
          ctx["me" + current].lineWidth = relativeStrokeSize;
          ctx["me" + current].beginPath();
          ctx["me" + current].moveTo(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1))
          );
          ctx["me" + current].rect(
            (OMX - canvas.getBoundingClientRect().left) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (OMY - canvas.getBoundingClientRect().top) /
              parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseX - OMX) / parseFloat(canvas.style.transform.slice(6, -1)),
            (mouseY - OMY) / parseFloat(canvas.style.transform.slice(6, -1))
          );
          ctx["me" + current].stroke();
          lineToggle = false;
        }

        if (!LMB) {
          temp.style.display = "none";
        }
      });
    }

    if (mode == "triangle") {
      window.completingTriangle = undefined;

      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }

        if (LMB && !window.triangleStartX && !window.completingTriangle) {
          window.triangleStartX =
            (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1));
          window.triangleStartY =
            (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1));
          temp.style.display = "block";
          tctx.lineWidth = relativeStrokeSize;
          tctx.strokeStyle = color;
          tctx.lineCap = "round";
        }

        if (!LMB && window.triangleStartX && !window.triangleSecondX) {
          window.triangleSecondX =
            (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1));
          window.triangleSecondY =
            (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1));
        }

        if (LMB && window.triangleSecondX && !window.completingTriangle) {
          window.completingTriangle = true;

          window.triangleStartX = undefined;
          window.triangleSecondX = undefined;
          temp.style.display = "none";

          if (LMB) {
            window.completingTriangle = false;
          }
        }

        if (window.triangleStartX) {
          tctx.clearRect(0, 0, temp.width, temp.height);
          tctx.beginPath();
          tctx.moveTo(window.triangleStartX, window.triangleStartY);

          if (window.triangleSecondX) {
            tctx.lineTo(window.triangleSecondX, window.triangleSecondY);
            tctx.lineTo(
              (mouseX - canvas.getBoundingClientRect().left) /
                parseFloat(canvas.style.transform.slice(6, -1)),
              (mouseY - canvas.getBoundingClientRect().top) /
                parseFloat(canvas.style.transform.slice(6, -1))
            );
            tctx.closePath();
          } else {
            tctx.lineTo(
              (mouseX - canvas.getBoundingClientRect().left) /
                parseFloat(canvas.style.transform.slice(6, -1)),
              (mouseY - canvas.getBoundingClientRect().top) /
                parseFloat(canvas.style.transform.slice(6, -1))
            );
          }
          tctx.stroke();
        }
      });
    }

    if (mode == "arc") {
      window.completingArc = undefined;

      Object.values(layers).forEach((layer) => {
        if (document.getElementById(layer.bitMap.id) != null) {
          ctx[layer.bitMap.id].globalCompositeOperation = "source-over";
        }

        if (LMB && !window.arcStartX && !window.completingArc) {
          window.arcStartX =
            (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1));
          window.arcStartY =
            (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1));
          temp.style.display = "block";
          tctx.lineWidth = relativeStrokeSize;
          tctx.strokeStyle = color;
          tctx.lineCap = "round";
        }

        if (!LMB && window.arcStartX && !window.arcSecondX) {
          window.arcSecondX =
            (mouseX - canvas.getBoundingClientRect().left) /
            parseFloat(canvas.style.transform.slice(6, -1));
          window.arcSecondY =
            (mouseY - canvas.getBoundingClientRect().top) /
            parseFloat(canvas.style.transform.slice(6, -1));
        }

        if (LMB && window.arcSecondX && !window.completingArc) {
          window.completingArc = true;

          window.arcStartX = undefined;
          window.arcSecondX = undefined;
          temp.style.display = "none";

          if (LMB) {
            window.completingArc = false;
          }
        }

        if (window.arcStartX) {
          tctx.clearRect(0, 0, temp.width, temp.height);
          tctx.beginPath();
          tctx.moveTo(window.arcStartX, window.arcStartY);

          if (window.arcSecondX) {
            tctx.beginPath();
            tctx.moveTo(window.arcStartX, window.arcStartY);
            tctx.quadraticCurveTo(
              (mouseX - canvas.getBoundingClientRect().left) /
                parseFloat(canvas.style.transform.slice(6, -1)) -
                (window.arcStartX + window.arcSecondX) / 2 +
                (mouseX - canvas.getBoundingClientRect().left) /
                  parseFloat(canvas.style.transform.slice(6, -1)),

              (mouseY - canvas.getBoundingClientRect().top) /
                parseFloat(canvas.style.transform.slice(6, -1)) -
                (window.arcStartY + window.arcSecondY) / 2 +
                (mouseY - canvas.getBoundingClientRect().top) /
                  parseFloat(canvas.style.transform.slice(6, -1)),
              window.arcSecondX,
              window.arcSecondY
            );
            tctx.stroke();
          } else {
            tctx.lineTo(
              (mouseX - canvas.getBoundingClientRect().left) /
                parseFloat(canvas.style.transform.slice(6, -1)),
              (mouseY - canvas.getBoundingClientRect().top) /
                parseFloat(canvas.style.transform.slice(6, -1))
            );
          }
          tctx.stroke();
        }
      });
    }
  }
  mouseX = e.x;
  mouseY = e.y;
  if (RMB) {
    Object.values(layers).forEach((layer) => {
      if (document.getElementById(layer.bitMap.id) != null) {
        document.getElementById(layer.bitMap.id).style.left =
          mouseX - COMX + OCPX + "px";
        document.getElementById(layer.bitMap.id).style.top =
          mouseY - COMY + OCPY + "px";
        bgCanvas.style.left = mouseX - COMX + OCPX + "px";
        bgCanvas.style.top = mouseY - COMY + OCPY + "px";
        temp.style.left = mouseX - COMX + OCPX + "px";
        temp.style.top = mouseY - COMY + OCPY + "px";
      }
    });
  }
  drawPreview();
}

function onMouseMove(e) {
  drawFunct(e);
}

function _isCanvasTarget(el) {
  return !!el && (el.classList?.contains?.("canvas") || el.id === "tempCanvas" || el.id === "backgroundCanvas");
}

function _firstTouchPoint(touch) {
  return { x: touch.clientX, y: touch.clientY };
}

function handleTouchStart(ev) {
  if (!ev.touches || ev.touches.length === 0) return;
  const touch = ev.touches[0];
  const pt = _firstTouchPoint(touch);
  const target = document.elementFromPoint(pt.x, pt.y);
  if (_isCanvasTarget(target)) {
    ev.preventDefault();
    mouseX = pt.x;
    mouseY = pt.y;
    onMouseDown({ which: 1, button: 0, x: pt.x, y: pt.y });
  }
}

function handleTouchMove(ev) {
  if (!ev.touches || ev.touches.length === 0) return;
  const touch = ev.touches[0];
  const pt = _firstTouchPoint(touch);
  const target = document.elementFromPoint(pt.x, pt.y);
  if (_isCanvasTarget(target)) {
    ev.preventDefault();
    onMouseMove({ x: pt.x, y: pt.y });
  }
}

function handleTouchEnd(ev) {

  onMouseUp();
}

addEventListener("touchstart", handleTouchStart, { passive: false });
addEventListener("touchmove", handleTouchMove, { passive: false });
addEventListener("touchend", handleTouchEnd, { passive: false });

function drawPreview() {

  const pctx = document
    .getElementById("previewId" + current)
    .getContext("2d", { willReadFrequently: true });

  pctx.clearRect(
    0,
    0,
    document.getElementById("previewId" + current).width,
    document.getElementById("previewId" + current).height
  );
  pctx.drawImage(
    document.getElementById("me" + current),
    0,
    0,
    document.getElementById("previewId" + current).width,
    (canvasHeightS / canvasWidthS) *
      document.getElementById("previewId" + current).width
  );
}

document.addEventListener(
  "contextmenu",
  (e) => e?.cancelable && e.preventDefault()
);
addEventListener("mousedown", onMouseDown);
addEventListener("mouseup", onMouseUp);
addEventListener("mousemove", onMouseMove);

//final init and outsider functions
document.getElementById("me0").style.transform = `scale(${zoom / 250})`;

var canvas = document.getElementById("me0");
ctx["me0"] = canvas.getContext("2d", { willReadFrequently: true });
ctx["me0"].lineWidth = 1;
ctx["me0"].lineCap = "round";

function clearDraw() {
  ctx["me" + current].clearRect(0, 0, canvas.width, canvas.height);
  const pctx = document
    .getElementById("previewId" + current)
    .getContext("2d", { willReadFrequently: true });
  pctx.clearRect(
    0,
    0,
    document.getElementById("previewId" + current).width,
    document.getElementById("previewId" + current).height
  );

  undoStackIndex[current]++;
  undoStack[current].push(
    layers["layer" + current].bitMap
      .getContext("2d", { willReadFrequently: true })
      .getImageData(0, 0, canvas.width, canvas.height)
  );
  redoStack[current] = [];
  redoStackIndex[current] = 0;
}
function changeColor(newColor) {
  color = newColor;
}

function downloadCanvas() {
  const saveCtx = saveCanvas.getContext("2d", { willReadFrequently: true });
  saveCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
  Object.values(layers).forEach((layer) => {
    saveCtx.drawImage(document.getElementById(layer.bitMap.id), 0, 0);
  });
  const link = document.createElement("a");
  link.href = saveCanvas.toDataURL("image/png");
  link.download = document.getElementById("pictureName").value + ".png";
  link.click();
}

function imageData() {
  const saveCtx = saveCanvas.getContext("2d", { willReadFrequently: true });
  saveCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
  Object.values(layers).forEach((layer) => {
    saveCtx.drawImage(document.getElementById(layer.bitMap.id), 0, 0);
  });
  console.log(saveCanvas.toDataURL());
  navigator.clipboard.writeText(saveCanvas.toDataURL());
}

function moveUp(ts) {
  var arr = [...Array(Object.keys(layers).length).keys()];
  var wrapper = document.getElementsByClassName(
    "previewContainerButActuallyRealThisTimeIPromise"
  );
  var wrapper2 = document.getElementsByClassName("canvasContainer");
  var items = Array.from(wrapper[0].children);
  var items2 = Array.from(wrapper2[0].children);
  var the = Array.from(
    document.getElementById("previewContainerButActuallyRealThisTimeIPromise")
      .children
  );

  Object.values(layers).forEach((layer) => {
    if (the[layer.preview.id.slice(9)].id.slice(18) == ts) {
      console.log(arr[layer.preview.id.slice(9)]);
      arr[layer.preview.id.slice(9)] =
        parseInt(arr[layer.preview.id.slice(9)]) + 1;
      arr[parseInt(layer.preview.id.slice(9)) + 1] =
        parseInt(arr[parseInt(layer.preview.id.slice(9)) + 1]) - 1;
      console.log(arr);
    }
  });

  arr.forEach(function (idx) {
    wrapper[0].appendChild(items[idx]);
  });

  arr.reverse().forEach(function (idx) {
    console.log(arr);
    wrapper2[0].prepend(items2[idx]);
  });

  arr.reverse();
}

function moveDown(pmo) {
  var arr = [...Array(Object.keys(layers).length).keys()];
  var wrapper = document.getElementsByClassName(
    "previewContainerButActuallyRealThisTimeIPromise"
  );
  var wrapper2 = document.getElementsByClassName("canvasContainer");
  var items = Array.from(wrapper[0].children);
  var items2 = Array.from(wrapper2[0].children);
  var the = Array.from(
    document.getElementById("previewContainerButActuallyRealThisTimeIPromise")
      .children
  );

  Object.values(layers).forEach((layer) => {
    if (the[layer.preview.id.slice(9)].id.slice(18) == pmo) {
      console.log(arr[layer.preview.id.slice(9)]);
      arr[layer.preview.id.slice(9)] =
        parseInt(arr[layer.preview.id.slice(9)]) - 1;
      arr[parseInt(layer.preview.id.slice(9)) - 1] =
        parseInt(arr[parseInt(layer.preview.id.slice(9)) - 1]) + 1;
      console.log(arr);
    }
  });

  arr.forEach(function (idx) {
    wrapper[0].appendChild(items[idx]);
  });

  arr.reverse().forEach(function (idx) {
    console.log(arr);
    wrapper2[0].prepend(items2[idx]);
  });

  arr.reverse();
}

function settings() {
  if (document.getElementById("settings").style.display == "none") {
    document.getElementById("settings").style.display = "block";
    document.getElementById("settings").scrollTo(0, 0);
  } else {
    document.getElementById("settings").style.display = "none";
  }
}

document.getElementById("myRange").oninput = function () {
  relativeStrokeSize = document.getElementById("myRange").value;
StrokeSize = document.getElementById("myRange").value;
};
bgCanvas.width = canvasWidthS;
bgCanvas.height = canvasHeightS;
bgCanvas.style.transform = `scale(${zoom / 250})`;
temp.width = canvasWidthS;
temp.height = canvasHeightS;
saveCanvas.width = canvasWidthS;
saveCanvas.height = canvasHeightS;
temp.style.transform = `scale(${zoom / 250})`;
//document.getElementById(layers["layer0"].bitMap.id).style.top = "700px";
document.getElementById("layerbarArrow").style.transform = "rotate(180deg)";
document.getElementById("topbar").style.width = window.innerWidth * 0.75 + "px";

layers["layer0"]["bitMap"].style.left =
  window.innerWidth / 2 +
  layers["layer0"]["bitMap"].getBoundingClientRect().width / 2;
layers["layer0"]["bitMap"].style.top = "0";
bgCanvas.style.left =
  window.innerWidth / 2 -
  layers["layer0"]["bitMap"].getBoundingClientRect().width -
  300;
bgCanvas.style.top = "0";
temp.style.left =
  window.innerWidth / 2 +
  layers["layer0"]["bitMap"].getBoundingClientRect().width / 2 -
  700;
temp.style.top = "0";

document.getElementById("me0").style.left = bgCanvas.style.left;
document.getElementById("me0").style.top = 0;
document.getElementById("tempCanvas").style.left = bgCanvas.style.left;
document.getElementById("tempCanvas").style.top = 0;
settings();
newlayer = false;

Pressure.set('#tempCanvas', {
  change: function(force, event){
    this.innerHTML = force;
    console.log(force);
    relativeStrokeSize = StrokeSize * (force+0.5);
  },
  unsupported: function(){
    force = 1;
    console.log(force);
    relativeStrokeSize = StrokeSize * (force+0.5);
  }
}, {polyfill: false});
