function drawHUD1(ctx, canvas, player) {
    if (!player) return;
    
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'left';
    const hudX = 15;
    const hudY = 20;
    const pipGreen = '#32CD32';

    ctx.fillStyle = pipGreen;
    ctx.fillText(`THRUST: ${(player.Ps > 0 ? 'ACCEL' : 'DECEL')}`, hudX, hudY);
    ctx.fillText(`WEIGHT: ${(player.properties.baseWeight + player.fuel).toFixed(0)}`, hudX, hudY + 20);
    ctx.fillText(`SPEED:  ${(player.v * 100).toFixed(0)}`, hudX, hudY + 40); // Scaled for display
}
