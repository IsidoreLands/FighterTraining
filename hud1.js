function drawHUD1(ctx, canvas, player, enemy) {
    // --- Helper function to calculate Ps ---
    const calculatePs = (fighter, isThrusting) => {
        const thrust = (isThrusting ? 2.0 : 1.0) * fighter.v * 50; // Thrust related to speed
        const drag = (fighter.v * fighter.v) * 15 + Math.abs(fighter.rotation) * 6000; // Drag from speed and turning
        const weight = 1.0 + (fighter.fuel / 100) * 0.5;
        return (thrust - drag) / weight;
    };

    player.Ps = calculatePs(player, keys.ArrowUp);
    enemy.Ps = calculatePs(enemy, true); // Assume AI is always managing thrust

    // --- Draw HUD ---
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'right';
    const hudX = canvas.width - 15;
    const hudY = 20;

    // Player Ps
    ctx.fillStyle = player.Ps >= 0 ? '#00FF00' : '#FF9900';
    ctx.fillText(`Player Ps: ${player.Ps.toFixed(0)}`, hudX, hudY);
    
    // Enemy Ps
    ctx.fillStyle = enemy.Ps >= 0 ? '#00FF00' : '#FF9900';
    ctx.fillText(`Enemy Ps:  ${enemy.Ps.toFixed(0)}`, hudX, hudY + 20);

    // E-M Advantage
    const emAdvantage = player.Ps - enemy.Ps;
    ctx.fillStyle = emAdvantage >= 0 ? '#22c55e' : '#ef4444';
    ctx.fillText(`Advantage: ${emAdvantage.toFixed(0)}`, hudX, hudY + 40);
    
    ctx.textAlign = 'left';
}
