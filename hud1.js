// HUD 1: EM Scores / Equations (Upper Right Corner)
function drawHUD1(ctx, canvas) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#00FF00'; // Vibrant green
    ctx.globalAlpha = 0.8; // Transparency
    const hud1X = canvas.width - 200; // 200px from right edge
    const hud1Y = 20; // 20px from top
    // Placeholder EM data (replace with actual metrics)
    ctx.fillText("Energy: 50000 ft", hud1X, hud1Y);
    ctx.fillText("Energy Rate: 100 ft/s", hud1X, hud1Y + 20);
    ctx.fillText("Efficiency: 0.8", hud1X, hud1Y + 40);
    ctx.globalAlpha = 1.0; // Reset transparency
}
console.log("HUD1 loaded");
