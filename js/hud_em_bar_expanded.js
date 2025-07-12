// hud_em_bar_expanded.js - Expanded HUD for FighterTraining
function HudEmBarExpanded() {
  const thrustBar = document.getElementById("thrust-bar");
  const dragBar = document.getElementById("drag-bar");
  const speedBar = document.getElementById("speed-bar");
  const weightBar = document.getElementById("weight-bar");
  const gBar = document.getElementById("g-bar");
  const fuelFlowBar = document.getElementById("fuel-flow-bar");
  const initialWeight = 1000; // kg
  const maxDrag = 30000; // N, increased for turns
  const referenceVelocity = 160; // pixels/s
  const maxG = 9; // g
  const maxFuelFlow = 0.5; // kg/s

  this.update = function (em) {
    console.log("Updating expanded HUD, Ps:", em.calculatePs(), "Fuel:", em.fuel);
    if (!thrustBar || !dragBar || !speedBar || !weightBar || !gBar || !fuelFlowBar) {
      console.error("Expanded HUD elements missing");
      return;
    }
    // Thrust bar: 0-100% (60000 N to 120000 N)
    const thrustPercent = ((em.thrust - 60000) / (120000 - 60000)) * 100;
    thrustBar.style.width = `${thrustPercent}%`;
    thrustBar.classList.toggle("pulsing", em.isAfterburning);

    // Drag bar: 0-100% of max drag
    const dragPercent = (em.drag / maxDrag) * 100;
    dragBar.style.width = `${dragPercent}%`;
    dragBar.style.background = em.drag > 5000 ? "#f00" : "#0f0";
    dragBar.classList.toggle("pulsing", em.drag > 5000);

    // Airspeed bar: 0-200% of reference velocity
    const speedPercent = (em.velocity / referenceVelocity) * 100;
    speedBar.style.width = `${Math.min(200, speedPercent)}%`;

    // Weight bar: 50-100% of initial weight
    const weightPercent = ((em.weight - 500) / (initialWeight - 500)) * 100;
    weightBar.style.width = `${weightPercent}%`;

    // G-Force bar: 0-100% (1-9 g)
    const gPercent = ((em.gForce - 1) / (maxG - 1)) * 100;
    gBar.style.width = `${gPercent}%`;
    gBar.style.background = em.gForce > 3 ? "#f00" : "#0f0";
    gBar.classList.toggle("pulsing", em.gForce > 3);

    // Fuel Flow bar: 0-100% (0.1 to 0.5 kg/s)
    const fuelFlowPercent = ((em.isAfterburning ? em.afterburnerBurn : em.militaryBurn) - 0.1) / (maxFuelFlow - 0.1) * 100;
    fuelFlowBar.style.width = `${fuelFlowPercent}%`;
    fuelFlowBar.classList.toggle("pulsing", em.isAfterburning);
  };
}
