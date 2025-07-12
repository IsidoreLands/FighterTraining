// hud_em_bar_expanded.js - Expanded HUD for FighterTraining
function HudEmBarExpanded() {
  const thrustLabel = document.getElementById("thrust-label"); // Assume added in HTML
  const thrustBar = document.getElementById("thrust-bar");
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

  this.update = function (em) {
    console.log("Updating expanded HUD, Ps:", em.calculatePs(), "Fuel:", em.fuel);
    if (!thrustBar || !dragBar || !speedBar || !weightBar || !gBar || !fuelFlowBar) {
      console.error("Expanded HUD elements missing");
      return;
    }
    // Thrust: Digital % and bar
    const thrustPercent = em.afterburnerLevel * 100;
    if (thrustLabel) thrustLabel.textContent = `${Math.round(thrustPercent)}%`; // Digital readout
    thrustBar.style.width = `${thrustPercent}%`;
    thrustBar.classList.toggle("pulsing", em.afterburnerLevel > 0.5);

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
