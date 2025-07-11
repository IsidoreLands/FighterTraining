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
    // Thrust bar: 0-100% (base to 2x base)
    const thrustPercent = ((em.thrust - em.baseThrust) / em.baseThrust) * 100;
    thrustBar.style.width = `${thrustPercent}%`;
    thrustBar.classList.toggle("pulsing", em.isAfterburning);

    // Drag bar: 0-100% of max drag
    const dragPercent = (em.drag / maxDrag) * 100;
    dragBar.style.width = `${dragPercent}%`;
    dragBar.style.background = em.drag > em.baseDrag ? "#f00" : "#0f0";
    dragBar.classList.toggle("pulsing", em.isTurning || em.isBraking);

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
    fuelFlowBar.classList.toggle("pulsing", em.isAfterburning);
  };
}
