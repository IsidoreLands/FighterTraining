function drawHUD1(ctx, canvas, player, enemy) {
    const calculatePs = (fighter, isThrusting) => {
        if (!fighter || !fighter.properties) return 0;
        const thrust = (isThrusting && fighter.fuel > 0 ? fighter.properties.afterburnerThrust : fighter.properties.militaryThrust);
        const drag = fighter.properties.dragCoefficient * (fighter.v * fighter.v) + Math.abs(fighter.rotation) * 40000;
        const weight = fighter.properties.baseWeight + fighter.fuel;
        if (weight === 0) return 0;
        return ((thrust - drag) / weight) * fighter.v;
    };

    player.Ps = calculatePs(player, keys.ArrowUp);
    enemy.Ps = calculatePs(enemy, true);

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'right';
    const hudX = canvas.width - 15;
    const hudY = 20;
    const pipGreen = '#32CD32'; // Standard PIP green
    const pipRed = '#ef4444';

    ctx.fillStyle = pipGreen; // Default to green
    ctx.fillText(`Player Ps: ${player.Ps.toFixed(0)}`, hudX, hudY);
    ctx.fillText(`Enemy Ps:  ${enemy.Ps.toFixed(0)}`, hudX, hudY + 20);

    const emAdvantage = player.Ps - enemy.Ps;
    ctx.fillStyle = emAdvantage >= 0 ? pipGreen : pipRed; // Red only for disadvantage
    ctx.fillText(`Advantage: ${emAdvantage.toFixed(0)}`, hudX, hudY + 40);
    
    ctx.textAlign = 'left';
}
