// js/afterburner.js - Visuals for afterburner
function drawAfterburner(ctx, aircraft, em, scale, offsetX, offsetY) {
  if (em.afterburnerLevel > 0) {
    ctx.save();
    ctx.translate(aircraft.x * scale + offsetX, aircraft.y * scale + offsetY);
    ctx.rotate(aircraft.angle);
    ctx.fillStyle = 'orange';
    ctx.globalAlpha = em.afterburnerLevel * 0.8;
    ctx.beginPath();
    ctx.moveTo(-15 * scale, -5 * scale);
    ctx.lineTo(-35 * scale, 0);
    ctx.lineTo(-15 * scale, 5 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
