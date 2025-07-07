function drawHUD2(ctx, canvas, player, enemy) {
    const barHeight = 15;
    const barY = canvas.height - barHeight - 5; // Position bars just above the bottom

    // --- Player Bars (Left Side) ---
    const playerBarWidth = canvas.width / 2 - 20;
    
    // Player Fuel
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(10, barY, playerBarWidth, barHeight);
    const playerFuelWidth = (player.fuel / 100) * playerBarWidth;
    ctx.fillStyle = player.fuel > 20 ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 100, 0, 0.8)';
    ctx.fillRect(10, barY, playerFuelWidth, barHeight);

    // Player Health
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(10, barY - barHeight - 5, playerBarWidth, barHeight);
    const playerHealthWidth = (player.health / 100) * playerBarWidth;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(10, barY - barHeight - 5, playerHealthWidth, barHeight);
    
    // Labels
    ctx.fillStyle = '#c9d1d9';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText("HLTH", 15, barY - barHeight - 8);
    ctx.fillText("FUEL", 15, barY - 8);

    // --- Enemy Bars (Right Side) ---
    const enemyBarX = canvas.width / 2 + 10;
    const enemyBarWidth = canvas.width / 2 - 20;

    // Enemy Health
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(enemyBarX, barY - barHeight - 5, enemyBarWidth, barHeight);
    const enemyHealthWidth = (enemy.health / 100) * enemyBarWidth;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.fillRect(enemyBarX + enemyBarWidth - enemyHealthWidth, barY - barHeight - 5, enemyHealthWidth, barHeight);

    // Enemy Fuel
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.fillRect(enemyBarX, barY, enemyBarWidth, barHeight);
    const enemyFuelWidth = (enemy.fuel / 100) * enemyBarWidth;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.fillRect(enemyBarX + enemyBarWidth - enemyFuelWidth, barY, enemyFuelWidth, barHeight);

    // Labels
    ctx.textAlign = 'right';
    ctx.fillText("HLTH", canvas.width - 15, barY - barHeight - 8);
    ctx.fillText("FUEL", canvas.width - 15, barY - 8);
    ctx.textAlign = 'left';
}
