// init.js - Initialize HUDs and game for FighterTraining
function initGame() {
  console.log("Loading init.js");
  try {
    const hud = new HudEmBar();
    const expandedHud = new HudEmBarExpanded();
    const fuelHud = new HudFuel();
    startGame(hud, expandedHud, fuelHud);
  } catch (e) {
    console.error("Initialization error:", e);
  }
}
initGame();
