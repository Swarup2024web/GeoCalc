let step = 0;
let A, B, C;
let AB, BC, angleB;
let canvas, ctx;
let scale = 10;
let dpr = window.devicePixelRatio || 1;
let stepLog;

function startConstruction() {
  step = 0;
  stepLog = document.getElementById("stepLog");
  stepLog.innerHTML = "";

  AB = parseFloat(document.getElementById("sideAB").value);
  angleB = parseFloat(document.getElementById("angleB").value);
  BC = parseFloat(document.getElementById("sideBC").value);

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  scale = canvas.clientWidth / (AB + BC + 10);
  let height = scale * Math.max(AB, BC) * 0.75;

  canvas.width = canvas.clientWidth * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.height = height + "px";

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  A = { x: 60, y: height - 40 };
  B = { x: A.x + AB * scale, y: A.y };

  const rad = angleB * Math.PI / 180;
  C = {
    x: B.x - BC * scale * Math.cos(rad),
    y: B.y - BC * scale * Math.sin(rad)
  };

  logStep(`Step 1: Given AB = ${AB} cm, ∠ABC = ${angleB}°, BC = ${BC} cm.`);
}

function nextStep() {
  step++;
  if (step === 1) {
    logStep("Step 2: Draw base AB using ruler.");
    animateLine(A, B, "A", "B");
  } else if (step === 2) {
    logStep("Step 3: Place protractor at point B and mark ∠ABC.");
    animateProtractorArc();
  } else if (step === 3) {
    logStep("Step 4: Using compass, draw arc from B intersecting arms of angle.");
    animateCompassArc();
  } else if (step === 4) {
    logStep("Step 5: Copy angle using compass by transferring DE arc to BC side.");
    drawCopiedArcAndMark();
  } else if (step === 5) {
    logStep("Step 6: Join BC and AC to complete triangle.");
    animateLine(B, C, null, "C");
    animateLine(A, C);
  }
}

function animateLine(p1, p2, label1, label2) {
  let i = 0;
  let total = 60;
  let dx = (p2.x - p1.x) / total;
  let dy = (p2.y - p1.y) / total;

  function draw() {
    if (i === 0) ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p1.x + dx * i, p1.y + dy * i);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (i === total) {
      if (label1) drawPoint(p1, label1);
      if (label2) drawPoint(p2, label2);
      return;
    }
    i++;
    requestAnimationFrame(draw);
  }
  draw();
}

function animateProtractorArc() {
  let start = Math.PI;
  let end = Math.PI - (angleB * Math.PI / 180);
  let current = start;
  let stepArc = (start - end) / 60;

  function drawArc() {
    ctx.beginPath();
    ctx.strokeStyle = "#00bcd4";
    ctx.lineWidth = 1.5;
    ctx.arc(B.x, B.y, 50, start, current, true);
    ctx.stroke();
    current -= stepArc;
    if (current > end) {
      requestAnimationFrame(drawArc);
    } else {
      ctx.fillStyle = "#00bcd4";
      ctx.fillText(`${angleB}°`, B.x - 45, B.y - 10);
    }
  }
  drawArc();
}

function animateCompassArc() {
  let radius = 40;
  let end = angleB * Math.PI / 180;
  let current = 0;
  let stepArc = end / 60;

  function drawArc() {
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#4caf50";
    ctx.arc(B.x, B.y, radius, 0, current, false);
    ctx.stroke();
    ctx.setLineDash([]);
    current += stepArc;
    if (current < end) {
      requestAnimationFrame(drawArc);
    }
  }
  drawArc();
}

function drawCopiedArcAndMark() {
  let arcRadius = 40;
  let x1 = B.x - arcRadius;
  let y1 = B.y;

  let angleRad = angleB * Math.PI / 180;
  let x2 = B.x - arcRadius * Math.cos(angleRad);
  let y2 = B.y - arcRadius * Math.sin(angleRad);

  let arcLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.arc(B.x, B.y, arcRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#ff5722";
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.arc(B.x, B.y, arcLength, 0, Math.PI * 2);
  ctx.strokeStyle = "#9c27b0";
  ctx.stroke();
  ctx.setLineDash([]);

  drawPoint({ x: x2, y: y2 }, "C'");
}

function drawPoint(pt, label) {
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.fillStyle = "black";
  if (label) ctx.fillText(label, pt.x - 10, pt.y - 10);
}

function logStep(text) {
  const log = document.createElement("div");
  log.textContent = text;
  stepLog.appendChild(log);
  stepLog.scrollTop = stepLog.scrollHeight;
  }
