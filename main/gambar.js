/*** GUI Part ***/
var tool = 0 
var tools = document.querySelectorAll(".tool")
var drawColor = null
var radius = 20
setColor([50, 50, 60])

for (var i = 0; i < tools.length; i++) {
  tools[i].onclick = function (id) {
    return function () {
      setTool(id)
    }
  }(i)
}

function setTool(id) {
  tool = id
  for (var i = 0; i < tools.length; i++) {
    tools[i].classList.remove("tool-selected")
    if (id == i)
      tools[i].classList.add("tool-selected")
  }
}

function setColor(c) {
  drawColor = c
  document.querySelector('#color-selector').style.backgroundColor = 
    'rgb(' +
    drawColor[0] + ',' +
    drawColor[1] + ',' +
    drawColor[2] +
    ')'
  document.querySelector('#color-picker').style.backgroundColor = 
    'rgb(' +
    drawColor[0] + ',' +
    drawColor[1] + ',' +
    drawColor[2] +
    ')'
  if ((drawColor[0] + drawColor[1] + drawColor[2]) / 3 < 122) {
    document.querySelector('#color-picker').style.color = 'white'
  } else {
    document.querySelector('#color-picker').style.color = 'black'
  }
}

document.onwheel = function (e) {
  if (e.deltaY < 0)
    radius+=2
  if (e.deltaY > 0)
    radius-=2
}

document.querySelector("#download").onclick = function () {
  graphic.save("Drawing.png")
}
document.querySelector("#color-selector").onclick = function () {
  document.querySelector("#color-picker").classList.add("open")
}
document.querySelector("#close-color-picker").onclick = function () {
  document.querySelector("#color-picker").classList.remove("open")
}
document.querySelector("#size-selector").onclick = function () {
  document.querySelector("#size-picker").classList.add("open")
}
document.querySelector("#close-size-picker").onclick = function () {
  document.querySelector("#size-picker").classList.remove("open")
}
for (var range of document.querySelectorAll(".color-range")) {
  range.oninput = refreshColorPicker
}
document.querySelector("#radius-range").oninput = refreshRadius
function refreshColorPicker() {
  n = [0, 0, 0]
  for (var i = 0; i < document.querySelectorAll(".color-range").length; i++) {
    n[i] = parseInt(document.querySelectorAll(".color-range")[i].value)
  }
  setColor(n)
}
function refreshRadius() {
  radius = parseInt(document.querySelector("#radius-range").value)
}
/*** Drawing part ***/
var lastPoint = null
var graphic = null

var squareOrigin = null
var circleOrigin = null

function setup() {
  createCanvas(document.body.clientWidth, document.body.clientHeight - 50).parent("#canvas")
  ellipseMode(CENTER)
  graphic = createGraphics(document.body.clientWidth, document.body.clientHeight - 50)
  graphic.background(255)
}

function draw() {
  background(255)
  image(graphic, 0, 0)
  
  if (tool == 0 || tool == 3)
    tool0Preview()
  
  if (mouseIsPressed) {
    if (!document.querySelector("#color-picker").classList.contains("open") && !document.querySelector("#size-picker").classList.contains("open"))
      drawOnGraphic()
  } else {
    lastPoint = null
    onMouseQuit()
  }
 
}

function tool0Preview()
{
  noFill()
  stroke(200)
  strokeWeight(2)
  ellipse(mouseX, mouseY, radius, radius)
}

function drawOnGraphic() {
  if (lastPoint == null)
    lastPoint = [mouseX, mouseY]
  
  if (tool == 0) {
    graphic.noFill()
    graphic.stroke(drawColor)
    graphic.strokeWeight(radius)
    graphic.line(mouseX, mouseY, lastPoint[0], lastPoint[1])
  }
  
  if (tool == 1) {
    if (squareOrigin == null) {
      squareOrigin = [mouseX, mouseY]
    } else {
      fill([drawColor[0], drawColor[1], drawColor[2], 122])
      noStroke()
      rect(squareOrigin[0], squareOrigin[1], mouseX - squareOrigin[0], mouseY - squareOrigin[1])
    }
  }
  
  if (tool == 2) {
    if (circleOrigin == null) {
      circleOrigin = [mouseX, mouseY]
    } else {
      fill([drawColor[0], drawColor[1], drawColor[2], 122])
      noStroke()
      let d = createVector(mouseX - circleOrigin[0], mouseY - circleOrigin[1]).mag()
      ellipseMode(CENTER)
      ellipse(circleOrigin[0], circleOrigin[1], d * 2, d * 2)
    }
  }
   
  if (tool == 3) {
    graphic.noFill()
    graphic.stroke(255)
    graphic.strokeWeight(radius)
    graphic.line(mouseX, mouseY, lastPoint[0], lastPoint[1])
  }
  
  lastPoint = [mouseX, mouseY]
}

function onMouseQuit() {
  if (squareOrigin != null) {
      graphic.fill(drawColor)
      graphic.noStroke()
      graphic.rect(squareOrigin[0], squareOrigin[1], mouseX - squareOrigin[0], mouseY - squareOrigin[1])
      squareOrigin = null
  }
  if (circleOrigin != null) {
    graphic.fill(drawColor)
    graphic.noStroke()
    let d = createVector(mouseX - circleOrigin[0], mouseY - circleOrigin[1]).mag()
    graphic.ellipseMode(CENTER)
    graphic.ellipse(circleOrigin[0], circleOrigin[1], d * 2, d * 2)
    circleOrigin = null
  }
}