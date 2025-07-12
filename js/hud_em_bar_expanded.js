// hud_em_bar_expanded.js - Expanded HUD for FighterTraining
function HudEmBarExpanded() {
  const thrustGauge = document.getElementById("thrust-gauge");
  const gaugeCtx = thrustGauge ? thrustGauge.getContext('2d') : null;
  const dragBar = document.getElementById("drag-bar");
  const speedBar = document.getElementById("speed-bar");
  const weightBar = document.getElementById("weight-bar");
  const gBar = document.getElementById("g-bar");
  const fuelFlowBar = document.getElementById("fuel-flow-bar");
  const initialWeight = 1000; // kg
  const maxDrag = 40000; // N
  const referenceVelocity = 160; // pixels/s
  const maxG = 9; // g
  const maxFuelFlow = 0.5; // kg/s

  function drawGauge(percent) {
    if (!gaugeCtx) return;
    gaugeCtx.clearRect(0, 0, thrustGauge.width, thrustGauge.height);
    gaugeCtx.lineWidth = 8;
    gaugeCtx.strokeStyle = '#000';
    gaugeCtx.beginPath();
    gaugeCtx.arc(40, 40, 30, Math.PI, 0);
    gaugeCtx.stroke();
    gaugeCtx.strokeStyle = '#0f0';
    gaugeCtx.beginPath();
    gaugeCtx.arc(40, 40, 30, Math.PI, Math.PI + (Math.PI * percent / 100));
    gaugeCtx.stroke();
    gaugeCtx.fillStyle = '#0f0';
    gaugeCtx.font = "12px monospace";
    gaugeCtx.textAlign = "center";
    gaugeCtx.fillText(`${percent}% RPM`, 40, 50);
  }

  this.update = function (em) {
    console.log("Updating expanded HUD, Ps:", em.calculatePs(), "Fuel:", em.fuel);
    if (!gaugeCtx || !dragBar || !speedBar || !weightBar || !gBar || !fuelFlowBar) {
      console.error("Expanded HUD elements missing");
      return;
    }
    // Thrust: Gauge with digital %
    const thrustPercent = Math.round(em.afterburnerLevel * 100);
    drawGauge(thrustPercent);

    // Drag bar: 0-100% of max drag
    const dragPercent = (em.drag / maxDrag) * 100;
    dragBar.style.width = `${dragPercent}%`;
    dragBar.style.background = em.drag > em.baseDrag ? "#f00" : "#0f0";
    dragBar.classList.toggle("pulsing", em.isTurning || em.brakeLevel > 0);

    // Airspeed bar: 0-100% of reference velocity
    const speedPercent = (em.velocity / referenceVelocity) * 100;
    speedBar.style.width = `${speedPercent}%`;

    // Weight bar: 50-100% of initial weight
    const weightPercent = ((em.weight - 500) / (initialWeight - 500)) * 100;
    weightBar.style.width = `${weightPercent}%`;

    // G-Force bar: 0-100% (1-9 g)
    const gPercent = ((em.gForce - 1) / (maxG - 1)) * 100;
    gBar.style.width = `${gPercent}%`;
    gBar.style.background = em.gForce > 3 ? "#f00" : "#0f0";
    gBar.classList.toggle("pulsing", em.gForce > 3);

    // Fuel Flow bar: 0-100% (military to afterburner)
    const fuelFlowPercent = ((em.isAfterburning ? em.afterburnerBurn : em.militaryBurn) / maxFuelFlow) * 100;
    fuelFlowBar.style.width = `${fuelFlowPercent}%`;
    fuelFlowBar.classList.toggle("pulsing", em.afterburnerLevel > 0);
  };
}
