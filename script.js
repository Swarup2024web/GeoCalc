let step = 0;
let A, B, C;
let AB, BC, angleB;
let canvas, ctx;
let scale = 2;

function startConstruction() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Reset step
  step = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get input values
  AB = parseFloat(document.getElementById("sideAB").value);
  angleB = parseFloat(document.getElementById("angleB").value);
  BC = parseFloat(document.getElementById("sideBC").value);

  // Define base points
  A = { x: canvas.width * 0.2, y: canvas.height * 0.7 };
  B = { x: A.x + AB * scale, y: A.y };

  // Pre-calculate point C
  const angleRad = (angleB * Math.PI) / 180;
  C = {
    x: B.x - BC * scale * Math.cos(angleRad),
    y: B.y - BC * scale * Math.sin(angleRad)
  };
}

function nextStep() {
  if (!ctx) return;

  step++;
  if (step === 1) drawRulerAndBase();
  if (step === 2) drawProtractor();
  if (step === 3) drawCompassArc();
  if (step === 4) drawSideBC();
  if (step === 5) completeTriangle();
}

function drawRulerAndBase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Draw base AB
  animateLine(A, B, () => {
    drawPoint(A, "A");
    drawPoint(B, "B");
  });
}

function drawProtractor() {
  // Draw protractor arc at B
  ctx.beginPath();
  ctx.strokeStyle = "#00bcd4";
  ctx.lineWidth = 1.5;
  ctx.arc(B.x, B.y, 60, Math.PI, Math.PI - (angleB * Math.PI / 180), true);
  ctx.stroke();
  ctx.fillStyle = "#00bcd4";
  ctx.fillText(`${angleB}°`, B.x - 35, B.y - 10);
}

function drawCompassArc() {
  // Simulate compass arc
  let radius = BC * scale;
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#4caf50";
  ctx.arc(B.x, B.y, radius, 0, -angleB * Math.PI / 180, true);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSideBC() {
  animateLine(B, C, () => drawPoint(C, "C"));
}

function completeTriangle() {
  animateLine(A, C, () => {});
}

function drawPoint(pt, label) {
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillText(label, pt.x - 10, pt.y - 10);
}

function animateLine(start, end, callback) {
  let progress = 0;
  const steps = 60;
  const dx = (end.x - start.x) / steps;
  const dy = (end.y - start.y) / steps;

  function drawStep() {
    if (progress > steps) {
      if (callback) callback();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + dx * progress, start.y + dy * progress);
    ctx.stroke();
    progress++;
    requestAnimationFrame(drawStep);
  }
  drawStep();
}
