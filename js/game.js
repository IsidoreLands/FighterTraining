// game.js - Game loop for FighterTraining
function startGame() {
  console.log("Loading game.js");
  let em;
  try {
    em = new EnergyManeuverability(60000, 5000, 1000, 160, 60, 60, 0.1, 0.5, 0.85, 0.06);
    console.log("EM initialized:", em);
  } catch (e) {
    console.error("Failed to load energy_maneuverability.js:", e);
    return;
  }
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not found");
    return;
  }
  canvas.width = 800;
  canvas.height = 600;
  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
  let aircraft = { x: canvas.width / 2, y: canvas.height / 2, angle: 0 };
  let lastTime = 0;

  window.addEventListener("keydown", (e) => {
    console.log("Key down:", e.key);
    if (e.key in keys) keys[e.key] = true;
  });
  window.addEventListener("keyup", (e) => {
    console.log("Key up:", e.key);
    if (e.key in keys) keys[e.key] = false;
  });

  function drawAircraft() {
    console.log("Drawing aircraft at", aircraft.x, aircraft.y, "with velocity", em.velocity);
    ctx.save();
    ctx.translate(aircraft.x, aircraft.y);
    ctx.rotate(aircraft.angle);
    ctx.fillStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    console.log("Game loop running, dt:", dt, "fuel:", em.fuel);
    em.update(dt, {
      isAfterburning: keys.ArrowUp,
      isBraking: keys.ArrowDown,
      isTurning: keys.ArrowLeft || keys.ArrowRight
    });
    aircraft.x += Math.cos(aircraft.angle) * em.velocity;
    aircraft.y += Math.sin(aircraft.angle) * em.velocity;
    aircraft.angle += (keys.ArrowLeft ? -em.turnSpeed : 0) + (keys.ArrowRight ? em.turnSpeed : 0);
    if (aircraft.x < 0) aircraft.x = canvas.width;
    if (aircraft.x > canvas.width) aircraft.x = 0;
    if (aircraft.y < 0) aircraft.y = canvas.height;
    if (aircraft.y > canvas.height) aircraft.y = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAircraft();
    requestAnimationFrame(gameLoop);
  }
  console.log("Starting game loop");
  requestAnimationFrame(gameLoop);
}
startGame();
