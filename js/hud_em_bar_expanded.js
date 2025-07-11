// hud_em_bar_expanded.js - Expanded HUD for FighterTraining
function HudEmBarExpanded() {
  const psBar = document.getElementById("ps-bar");
  const neutralMarker = document.getElementById("neutral-marker");
  const thrustBar = document.getElementById("thrust-bar");
  const dragBar = document.getElementById("drag-bar");
  const speedBar = document.getElementById("speed-bar");
  const weightBar = document.getElementById("weight-bar");
  const fuelBar = document.getElementById("fuel-bar");
  const gBar = document.getElementById("g-bar");
  const fuelFlowBar = document.getElementById("fuel-flow-bar");
  const initialPs = ((60000 - 5000) * 160) / 1000 / 10; // Baseline Ps
  const initialWeight = 1000; // kg
  const maxDrag = 20000; // N
  const referenceVelocity = 160; // pixels/s
  const initialFuel = 60; // kg
  const maxG = 9; // g
  const maxFuelFlow = 0.5; // kg/s

  this.update = function (em) {
    // Ps bar: -100% to +100% relative to initial Ps
    const ps = em.calculatePs() / 10;
    const psDelta = (ps - initialPs) / initialPs * 100;
    const clampedPsDelta = Math.max(-100, Math.min(100, psDelta));
    psBar.style.width = `${Math.abs(clampedPsDelta)}%`;
    psBar.style.left = clampedPsDelta >= 0 ? "50%" : `${50 - Math.abs(clampedPsDelta)}%`;
    psBar.style.transform = clampedPsDelta >= 0 ? "translateX(-50%)" : "translateX(0)";
    psBar.style.background = clampedPsDelta >= 0 ? "#0f0" : "#f00";
    psBar.classList.toggle("pulsing", Math.abs(clampedPsDelta) >= 15);
    const neutralPs = ((60000 - 5000) * em.velocity) / em.weight / 10;
    const neutralDelta = (neutralPs - initialPs) / initialPs * 100;
    const clampedNeutralDelta = Math.max(-100, Math.min(100, neutralDelta));
    neutralMarker.style.left = clampedNeutralDelta >= 0 ? `${50 + clampedNeutralDelta / 2}%` : `${50 - Math.abs(clampedNeutralDelta) / 2}%`;

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

    // Fuel bar: 0-100%
    const fuelPercent = (em.fuel / initialFuel) * 100;
    fuelBar.style.width = `${fuelPercent}%`;
    fuelBar.style.background = fuelPercent > 20 ? "#0f0" : "#f00";
    fuelBar.classList.toggle("pulsing", fuelPercent <= 20);

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
