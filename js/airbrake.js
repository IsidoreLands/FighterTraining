// js/airbrake.js - Visuals for airbrake
function drawAirbrake(ctx, aircraft, em) {
  if (em.brakeLevel > 0) {
    ctx.save();
    ctx.translate(aircraft.x, aircraft.y);
    ctx.rotate(aircraft.angle);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.globalAlpha = em.brakeLevel * 0.8;
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.stroke();
    ctx.restore();
  }
}
