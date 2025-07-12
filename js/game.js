// game.js - Game loop for FighterTraining
function startGame(hud, expandedHud, fuelHud) {
  console.log("Loading game.js");
  let em;
  try {
    em = new EnergyManeuverability(platonicParams);
    console.log("EM initialized with platonic params:", em);
  } catch (e) {
    console.error("Failed to load energy_maneuverability.js or platonic_aircraft.js:", e);
    return;
  }
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not found");
    return;
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 60) * dpr; // Minus HUD space
    ctx.scale(dpr, dpr);
    aircraft.x = window.innerWidth / 2;
    aircraft.y = (window.innerHeight - 60) / 2;
    console.log("Canvas resized to", window.innerWidth, "x", window.innerHeight - 60);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, KeyH: false };
  let aircraft = { x: window.innerWidth / 2, y: (window.innerHeight - 60) / 2, angle: 0 };
  let lastTime = 0;
  let gameOver = false;
  let activeHud = 0; // 0: Ps, 1: Expanded, 2: Fuel (fuel always on)

  window.addEventListener("keydown", (e) => {
    console.log("Key down:", e.key);
    if (e.key in keys) {
      keys[e.key] = true;
      e.preventDefault();
    }
    if (e.key === "KeyH") {
      activeHud = (activeHud + 1) % 3;
      console.log("Switching to HUD:", activeHud);
      document.getElementById("ps-hud").style.display = activeHud === 0 ? "block" : "none";
      document.getElementById("expanded-hud").style.display = activeHud === 1 ? "block" : "none";
    }
  });
  window.addEventListener("keyup", (e) => {
    console.log("Key up:", e.key);
    if (e.key in keys) {
      keys[e.key] = false;
      e.preventDefault();
    }
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

  function drawGameOver() {
    ctx.fillStyle = "#f00";
    ctx.font = "48px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", window.innerWidth / 2, (window.innerHeight - 60) / 2);
  }

  function gameLoop(time) {
    if (gameOver) {
      drawGameOver();
      return;
    }
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.033);
    lastTime = time;
    console.log("Game loop running, dt:", dt, "fuel:", em.fuel, "velocity:", em.velocity);
    em.update(dt, {
      isAfterburning: keys.ArrowUp,
      isBraking: keys.ArrowDown,
      isTurning: keys.ArrowLeft || keys.ArrowRight
    });
    if (em.fuel <= 0) {
      gameOver = true;
      console.log("Fuel depleted, game over");
      return;
    }
    aircraft.x += Math.cos(aircraft.angle) * em.velocity * dt;
    aircraft.y += Math.sin(aircraft.angle) * em.velocity * dt;
    aircraft.angle += (keys.ArrowLeft ? -em.turnSpeed : 0) + (keys.ArrowRight ? em.turnSpeed : 0);
    if (aircraft.x < 0) aircraft.x = window.innerWidth;
    if (aircraft.x > window.innerWidth) aircraft.x = 0;
    if (aircraft.y < 0) aircraft.y = window.innerHeight - 60;
    if (aircraft.y > window.innerHeight - 60) aircraft.y = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAircraft();
    try {
      if (activeHud === 0) hud.update(em);
      else if (activeHud === 1) expandedHud.update(em);
      fuelHud.update(em);
    } catch (e) {
      console.error("HUD update error:", e);
    }
    requestAnimationFrame(gameLoop);
  }
  console.log("Starting game loop");
  requestAnimationFrame(gameLoop);
}
