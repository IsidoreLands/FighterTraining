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
  const logicalWidth = 800; // Fixed logical width
  const logicalHeight = 400; // Fixed for horizontal
  let scale = 1;
  let offsetX = 0, offsetY = 0;
  let aircraft = { x: logicalWidth / 2, y: logicalHeight / 2, angle: 0 };

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = (window.innerHeight - 60) * dpr;
    scale = Math.min(canvas.width / logicalWidth, canvas.height / logicalHeight);
    offsetX = (canvas.width - logicalWidth * scale) / 2;
    offsetY = (canvas.height - logicalHeight * scale) / 2;
    em.velocity = logicalWidth / 5; // Fixed 5s cross
    console.log("Canvas resized to", window.innerWidth, "x", window.innerHeight - 60, "scale", scale.toFixed(2), "velocity", em.velocity.toFixed(2));
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, KeyH: false, KeyL: false, KeyQ: false };
  let lastTime = 0;
  let gameOver = false;
  let activeHud = 1; // Start with expanded visible for testing
  let startTime = Date.now(); // For filename
  const API_KEY = "your_secret_api_key"; // Match droplet key

  window.addEventListener("keydown", (e) => {
    console.log("Key down:", e.key);
    if (e.key in keys) {
      keys[e.key] = true;
      e.preventDefault();
    }
    if (e.key.toUpperCase() === "L") {
      e.preventDefault();
      exportTelemetry();
    }
    if (e.key.toUpperCase() === "Q") {
      e.preventDefault();
      gameOver = true;
      exportTelemetry(); // Auto-export on quit
    }
  });
  window.addEventListener("keyup", (e) => {
    console.log("Key up:", e.key);
    if (e.key in keys) {
      keys[e.key] = false;
      e.preventDefault();
    }
  });

  let telemetryLog = []; // Buffer for telemetry
  let lastLogTime = 0; // For interval logging

  function getCurrentKeys() {
    return Object.keys(keys).filter(k => keys[k]).join(",");
  }

  function logTelemetry(dt) {
    telemetryLog.push({
      timestamp: Date.now(),
      dt: dt.toFixed(4),
      velocity: em.velocity.toFixed(2),
      thrust: em.thrust.toFixed(2),
      drag: em.drag.toFixed(2),
      Ps: em.calculatePs().toFixed(2),
      fuel: em.fuel.toFixed(2),
      keys: getCurrentKeys()
    });
  }

  function getPlayerHash() {
    return Math.random().toString(36).substring(2, 10); // 8-char random for anonymous
  }

  function getOutcome() {
    if (em.fuel <= 0) return "fuel_out";
    return "quit"; // Expand for win/loss in future
  }

  async function exportTelemetry() {
    const endTime = Date.now();
    const name = `telemetry_platonic_v1_g1_p${getPlayerHash()}_o_none_${Math.floor(startTime/1000)}_${Math.floor(endTime/1000)}_${getOutcome()}.json`;
    const data = JSON.stringify(telemetryLog, null, 2);
    try {
      const response = await fetch('http://159.65.246.113:5000/upload', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-API-Key': API_KEY},
        body: JSON.stringify({filename: name, content: data})
      });
      if (response.ok) console.log("Telemetry uploaded to droplet");
      else console.error("Upload failed");
    } catch (e) {
      console.error("Upload error:", e);
    }
    telemetryLog = []; // Clear after export
    startTime = Date.now(); // Reset for next run
  }

  let particles = [];

  function createParticles(num) {
    for (let i = 0; i < num; i++) {
      particles.push({
        x: aircraft.x - Math.cos(aircraft.angle) * 20,
        y: aircraft.y - Math.sin(aircraft.angle) * 20,
        vx: (Math.random() - 0.5) * 2 - Math.cos(aircraft.angle) * em.velocity * 0.05,
        vy: (Math.random() - 0.5) * 2 - Math.sin(aircraft.angle) * em.velocity * 0.05,
        life: Math.random() * 0.5 + 0.5,
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
      ctx.arc(p.x * scale + offsetX, p.y * scale + offsetY, 2 * p.life * scale, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function drawAircraft() {
    console.log("Drawing aircraft at logical", aircraft.x, aircraft.y, "with velocity", em.velocity);
    ctx.save();
    ctx.translate(aircraft.x * scale + offsetX, aircraft.y * scale + offsetY);
    ctx.rotate(aircraft.angle);
    ctx.fillStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(20 * scale, 0);
    ctx.lineTo(-10 * scale, 10 * scale);
    ctx.lineTo(-10 * scale, -10 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    drawAfterburner(ctx, aircraft, em, scale, offsetX, offsetY);
    drawAirbrake(ctx, aircraft, em, scale, offsetX, offsetY);
  }

  function drawGameOver() {
    ctx.fillStyle = "#f00";
    ctx.font = "48px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  function gameLoop(time) {
    if (gameOver) {
      drawGameOver();
      exportTelemetry(); // Auto-export on game over
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
    if (time - lastLogTime > 0.5) { // Log every 0.5s to reduce volume
      logTelemetry(dt);
      lastLogTime = time;
    }
    if (em.fuel <= 0) {
      gameOver = true;
      console.log("Fuel depleted, game over");
      return;
    }
    aircraft.x += Math.cos(aircraft.angle) * em.velocity * dt;
    aircraft.y += Math.sin(aircraft.angle) * em.velocity * dt;
    aircraft.angle += (keys.ArrowLeft ? -em.turnSpeed : 0) + (keys.ArrowRight ? em.turnSpeed : 0);
    // Wrap in logical units
    if (aircraft.x < 0) aircraft.x += logicalWidth;
    if (aircraft.x > logicalWidth) aircraft.x -= logicalWidth;
    if (aircraft.y < 0) aircraft.y += logicalHeight;
    if (aircraft.y > logicalHeight) aircraft.y -= logicalHeight;
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
