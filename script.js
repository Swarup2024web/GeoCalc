function startConstruction() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get input values
  const AB = parseFloat(document.getElementById("sideAB").value);
  const angleB = parseFloat(document.getElementById("angleB").value);
  const BC = parseFloat(document.getElementById("sideBC").value);

  // Scale factor for visibility
  const scale = 2;

  // Start from point A
  const A = { x: 150, y: 300 };
  const B = { x: A.x + AB * scale, y: A.y };

  // Draw base AB using "ruler"
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.stroke();

  // Draw point A and B
  drawPoint(ctx, A.x, A.y, "A");
  drawPoint(ctx, B.x, B.y, "B");

  // Draw protractor arc at B (showing angle)
  const angleRad = (angleB * Math.PI) / 180;
  const C = {
    x: B.x - BC * scale * Math.cos(angleRad),
    y: B.y - BC * scale * Math.sin(angleRad)
  };

  // Draw side BC
  ctx.beginPath();
  ctx.moveTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();

  drawPoint(ctx, C.x, C.y, "C");

  // Draw AC to complete triangle
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();

  // Optional: draw angle arc at B
  ctx.beginPath();
  ctx.arc(B.x, B.y, 40, Math.PI, Math.PI - angleRad, true);
  ctx.strokeStyle = "blue";
  ctx.stroke();

  // Label angle
  ctx.fillStyle = "blue";
  ctx.fillText(`${angleB}°`, B.x - 25, B.y - 10);
}

// Helper to draw labeled points
function drawPoint(ctx, x, y, label) {
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillText(label, x - 10, y - 10);
}
