// js/airbrake.js - Visuals for airbrake
function drawAirbrake(ctx, aircraft, em, scale, offsetX, offsetY) {
  if (em.brakeLevel > 0) {
    ctx.save();
    ctx.translate(aircraft.x * scale + offsetX, aircraft.y * scale + offsetY);
    ctx.rotate(aircraft.angle);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2 * scale;
    ctx.globalAlpha = em.brakeLevel * 0.8;
    ctx.beginPath();
    ctx.moveTo(-10 * scale, -10 * scale);
    ctx.lineTo(-10 * scale, 10 * scale);
    ctx.stroke();
    ctx.restore();
  }
}
