// hud_em_bar.js - Ps bar HUD for FighterTraining
function HudEmBar() {
  const psBar = document.getElementById("ps-bar");
  const neutralMarker = document.getElementById("neutral-marker");
  const initialPs = ((60000 - 5000) * 164.8) / 1000; // Adjusted baseline for new velocity

  this.update = function (em) {
    if (!psBar || !neutralMarker) {
      console.error("Ps bar or neutral marker not found");
      return;
    }
    console.log("Updating Ps HUD, Ps:", em.calculatePs());
    const ps = em.calculatePs();
    const psDelta = (ps - initialPs) / initialPs * 100;
    const clampedPsDelta = Math.max(-300, Math.min(300, psDelta)); // Increased range for overflow
    psBar.style.width = `${Math.abs(clampedPsDelta)}%`;
    psBar.style.left = clampedPsDelta >= 0 ? "50%" : `${50 - Math.abs(clampedPsDelta)}%`;
    psBar.style.transform = clampedPsDelta >= 0 ? "translateX(-50%)" : "translateX(0)";
    psBar.style.background = clampedPsDelta >= 0 ? "#0f0" : "#f00";
    psBar.classList.toggle("pulsing", Math.abs(clampedPsDelta) >= 15);
    const neutralPs = em.calculateNeutralPs();
    const neutralDelta = (neutralPs - initialPs) / initialPs * 100;
    const clampedNeutralDelta = Math.max(-300, Math.min(300, neutralDelta));
    neutralMarker.style.left = clampedNeutralDelta >= 0 ? `${50 + clampedNeutralDelta / 2}%` : `${50 - Math.abs(clampedNeutralDelta) / 2}%`;
  };
}
