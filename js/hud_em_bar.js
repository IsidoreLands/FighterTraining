// hud_em_bar.js - Ps bar HUD for FighterTraining
function HudEmBar() {
  const psBar = document.getElementById("ps-bar");
  const neutralMarker = document.getElementById("neutral-marker");
  const initialPs = ((60000 - 5000) * 160) / 1000 / 10; // Baseline Ps

  this.update = function (em) {
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
  };
}
