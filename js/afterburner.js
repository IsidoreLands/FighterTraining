// js/afterburner.js - Visuals for afterburner
function drawAfterburner(ctx, aircraft, em) {
  if (em.afterburnerLevel > 0) {
    ctx.save();
    ctx.translate(aircraft.x, aircraft.y);
    ctx.rotate(aircraft.angle);
    ctx.fillStyle = 'orange';
    ctx.globalAlpha = em.afterburnerLevel * 0.8;
    ctx.beginPath();
    ctx.moveTo(-15, -5);
    ctx.lineTo(-35, 0);
    ctx.lineTo(-15, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
