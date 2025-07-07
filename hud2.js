function drawHUD2(ctx, canvas, player) {
    if (!player || !player.properties) return;

    const barHeight = 15;
    const barWidth = canvas.width / 4; // Bar is 1/4 of screen width
    const barX = 10;
    const barY = canvas.height - barHeight - 10;
    
    const pipGreen = '#32CD32';
    const pipCyan = 'rgba(0, 255, 255, 0.8)';
    const pipOrange = 'rgba(255, 100, 0, 0.8)';

    // Fuel Bar
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    const playerFuelWidth = (player.fuel / player.properties.maxFuel) * barWidth;
    ctx.fillStyle = player.fuel > (player.properties.maxFuel * 0.2) ? pipCyan : pipOrange;
    ctx.fillRect(barX, barY, playerFuelWidth, barHeight);
    
    // Label
    ctx.fillStyle = pipGreen;
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText("FUEL", barX + 5, barY + barHeight - 4);
}
