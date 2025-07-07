function drawHUD2(ctx, canvas, player, enemy) {
    if (!player || !enemy || !player.properties) return;

    const barHeight = 15;
    const barY = canvas.height - barHeight - 5;
    const healthYOffset = barY - barHeight - 5;
    const pipGreen = '#32CD32';
    const pipRed = '#ef4444';
    const pipCyan = 'rgba(0, 255, 255, 1)';
    const pipOrange = 'rgba(255, 100, 0, 0.8)';
    const pipWhite = '#c9d1d9';

    // --- Player Bars (Left Side) ---
    const playerBarWidth = canvas.width / 2 - 20;
    
    // Health
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(10, healthYOffset, playerBarWidth, barHeight);
    const playerHealthWidth = (player.health / 100) * playerBarWidth;
    ctx.fillStyle = player.health > 30 ? pipGreen : pipRed;
    ctx.fillRect(10, healthYOffset, playerHealthWidth, barHeight);

    // Fuel
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(10, barY, playerBarWidth, barHeight);
    const playerFuelWidth = (player.fuel / player.properties.maxFuel) * playerBarWidth;
    ctx.fillStyle = player.fuel > (player.properties.maxFuel * 0.2) ? pipCyan : pipOrange;
    ctx.fillRect(10, barY, playerFuelWidth, barHeight);

    // Labels
    ctx.fillStyle = pipGreen; // Default text to green
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText("HLTH", 15, healthYOffset + barHeight - 4);
    ctx.fillText("FUEL", 15, barY + barHeight - 4);

    // --- Enemy Bars (Right Side) ---
    const enemyBarX = canvas.width / 2 + 10;
    const enemyBarWidth = canvas.width / 2 - 20;

    // Health
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(enemyBarX, healthYOffset, enemyBarWidth, barHeight);
    const enemyHealthWidth = (enemy.health / 100) * enemyBarWidth;
    ctx.fillStyle = enemy.health > 30 ? pipGreen : pipRed;
    ctx.fillRect(enemyBarX + enemyBarWidth - enemyHealthWidth, healthYOffset, enemyHealthWidth, barHeight);

    // Fuel
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(enemyBarX, barY, enemyBarWidth, barHeight);
    const enemyFuelWidth = (enemy.fuel / enemy.properties.maxFuel) * enemyBarWidth;
    ctx.fillStyle = pipCyan;
    ctx.fillRect(enemyBarX + enemyBarWidth - enemyFuelWidth, barY, enemyFuelWidth, barHeight);

    // Labels
    ctx.fillStyle = pipGreen; // Default text to green
    ctx.textAlign = 'right';
    ctx.fillText("HLTH", canvas.width - 15, healthYOffset + barHeight - 4);
    ctx.fillText("FUEL", canvas.width - 15, barY + barHeight - 4);
    ctx.textAlign = 'left';
}
