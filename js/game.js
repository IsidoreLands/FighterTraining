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
  let aircraft = { x: window.innerWidth / 2, y: (window.innerHeight - 60) / 2, angle: 0 }; // Moved early

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 60) * dpr; // Minus HUD space
    ctx.scale(dpr, dpr);
    aircraft.x = window.innerWidth / 2;
    aircraft.y = (window.innerHeight - 60) / 2;
    em.velocity = window.innerWidth / 5; // Dynamic for exact 5s cruise cross
    console.log("Canvas resized to", window.innerWidth, "x", window.innerHeight - 60, "velocity reset to", em.velocity);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, KeyH: false };
  let lastTime = 0;
  let gameOver = false;
  let activeHud = 1; // Start with expanded visible for testing

  window.addEventListener("keydown", (e) => {
    console.log("Key down:", e.key);
    if (e.key in keys) {
      keys[e.key] = true;
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    console.log("Key up:", e.key);
    if (e.key in keys) {
      keys[e.key] = false;
      e.preventDefault();
    }
  });

  let particles = []; // For afterburner effects

  function createParticles(num) {
    for (let i = 0; i < num; i++) {
      particles.push({
        x: aircraft.x - Math.cos(aircraft.angle) * 20, // Behind aircraft
        y: aircraft.y - Math.sin(aircraft.angle) * 20,
        vx: (Math.random() - 0.5) * 2 - Math.cos(aircraft.angle) * em.velocity * 0.05,
        vy: (Math.random() - 0.5) * 2 - Math.sin(aircraft.angle) * em.velocity * 0.05,
        life: Math.random() * 0.5 + 0.5, // 0.5 to 1 second life
        color: `rgb(255, ${Math.floor(Math.random() * 150 + 100)}, 0)`
      });
    }
  }

  function updateParticles(dt) {
    particles = particles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      return p.life > 0;
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * p.life, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

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
    drawAfterburner(ctx, aircraft, em); // Call from afterburner.js
    drawAirbrake(ctx, aircraft, em); // Call from airbrake.js
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
    em.update(dt, {
      isAfterburning: keys.ArrowUp,
      isBraking: keys.ArrowDown,
      isTurning: keys.ArrowLeft || keys.ArrowRight
    });
    console.log(`Telemetry: dt=${dt.toFixed(4)}, velocity=${em.velocity.toFixed(2)}, thrust=${em.thrust.toFixed(2)}, drag=${em.drag.toFixed(2)}, Ps=${em.calculatePs().toFixed(2)}, fuel=${em.fuel.toFixed(2)}`); // Telemetry log
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
    drawParticles();
    drawAircraft();
    try {
      hud.update(em); // Ps always for base
      expandedHud.update(em); // Expanded always for testing
      fuelHud.update(em);
    } catch (e) {
      console.error("HUD update error:", e);
    }
    if (em.afterburnerLevel > 0) {
      createParticles(5 * em.afterburnerLevel); // Particles based on level
    }
    updateParticles(dt);
    requestAnimationFrame(gameLoop);
  }
  console.log("Starting game loop");
  requestAnimationFrame(gameLoop);
}
