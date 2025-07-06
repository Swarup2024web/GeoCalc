let step = 0;
let A, B, C, arc1, arc2, intersection;
let AB, BC, angleB;
let canvas, ctx;
let scale = 10; // 10 pixels = 1 cm (default)

function startConstruction() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  AB = parseFloat(document.getElementById("sideAB").value);
  angleB = parseFloat(document.getElementById("angleB").value);
  BC = parseFloat(document.getElementById("sideBC").value);

  scale = Math.floor(canvas.clientWidth / (AB + BC + 10));

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth * 0.6;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  step = 0;

  A = { x: canvas.width * 0.2, y: canvas.height * 0.75 };
  B = { x: A.x + AB * scale, y: A.y };

  const angleRad = (angleB * Math.PI) / 180;
  C = {
    x: B.x - BC * scale * Math.cos(angleRad),
    y: B.y - BC * scale * Math.sin(angleRad)
  };
}

function nextStep() {
  if (!ctx) return;
  step++;

  if (step === 1) {
    drawRulerAndBase();
  }
  else if (step === 2) {
    drawProtractorAtB();
  }
  else if (step === 3) {
    drawAngleArcUsingCompass();
  }
  else if (step === 4) {
    copyAngleToBCUsingCompass();
  }
  else if (step === 5) {
    drawFinalTriangle();
  }
}

function drawRulerAndBase() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.stroke();

  drawPoint(A, "A");
  drawPoint(B, "B");
}

function drawProtractorAtB() {
  ctx.beginPath();
  ctx.arc(B.x, B.y, 60, Math.PI, Math.PI - angleB * Math.PI / 180, true);
  ctx.strokeStyle = "#00bcd4";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#00bcd4";
  ctx.fillText(`${angleB}°`, B.x - 40, B.y - 10);
}

function drawAngleArcUsingCompass() {
  const r = 40;
  const x1 = B.x - r;
  const x2 = B.x - r * Math.cos(angleB * Math.PI / 180);
  const y2 = B.y - r * Math.sin(angleB * Math.PI / 180);

  arc1 = { x: B.x, y: B.y, r: r };
  arc2 = { x: B.x, y: B.y, x1, y1: B.y, x2, y2 };

  // Arc
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(arc1.x, arc1.y, arc1.r, 0, -angleB * Math.PI / 180, true);
  ctx.strokeStyle = "#4caf50";
  ctx.stroke();
  ctx.setLineDash([]);

  // Intersections
  drawPoint({ x: arc2.x1, y: arc2.y1 }, "D");
  drawPoint({ x: arc2.x2, y: arc2.y2 }, "E");
}

function copyAngleToBCUsingCompass() {
  const radius = distance(arc2.x1, arc2.y1, arc2.x2, arc2.y2);
  const arcCenter = B;
  const r = 40;

  // Copy base arc
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(arcCenter.x, arcCenter.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#ff5722";
  ctx.stroke();
  ctx.setLineDash([]);

  // Copy segment
  const newX = arcCenter.x - radius;
  intersection = {
    x: arcCenter.x - radius * Math.cos(angleB * Math.PI / 180),
    y: arcCenter.y - radius * Math.sin(angleB * Math.PI / 180)
  };

  drawPoint(intersection, "C'");
}

function drawFinalTriangle() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Join BC
  ctx.beginPath();
  ctx.moveTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();

  // Join AC
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();

  drawPoint(C, "C");
}

function drawPoint(pt, label) {
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillText(label, pt.x - 10, pt.y - 10);
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    }
