// hud_fuel.js - Fuel bar HUD for FighterTraining
function HudFuel() {
  const fuelBar = document.getElementById("fuel-bar");
  const initialFuel = 60; // kg

  this.update = function (em) {
    if (!fuelBar) {
      console.error("Fuel bar element not found");
      return;
    }
    console.log("Updating fuel HUD, fuel:", em.fuel);
    const fuelPercent = (em.fuel / initialFuel) * 100;
    fuelBar.style.width = `${fuelPercent}%`;
    fuelBar.style.background = fuelPercent > 20 ? "#0f0" : "#f00";
    fuelBar.classList.toggle("pulsing", fuelPercent <= 20);
  };
}
