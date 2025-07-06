// HUD 2: Fuel and Health Bars (Bottom Strips)
// Placeholder variables (to be replaced with game mechanics)
let fuel = 100; // Max fuel is 100
let health = 100; // Max health is 100
const fuelThreshold = 20; // Fuel bar turns red below 20%

function drawHUD2(ctx, canvas) {
    const barHeight = 20;
    const barMargin = 5;
    const fuelBarY = canvas.height - 2 * barHeight - barMargin; // Fuel bar above health bar
    const healthBarY = canvas.height - barHeight; // Health bar at bottom

    // Fuel Bar
    ctx.globalAlpha = 0.5; // Background transparency
    ctx.fillStyle = '#004400'; // Dark green background
    ctx.fillRect(0, fuelBarY, canvas.width, barHeight); // Full bar background
    ctx.globalAlpha = 0.8; // Filled portion transparency
    ctx.fillStyle = fuel < fuelThreshold ? '#FF0000' : '#00FF00'; // Red if low, else green
    const fuelWidth = (fuel / 100) * canvas.width; // Proportional width
    ctx.fillRect(0, fuelBarY, fuelWidth, barHeight); // Filled portion
    ctx.fillStyle = '#00FF00';
    ctx.fillText("Fuel", 10, fuelBarY - 5); // Label above bar

    // Health Bar
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#004400'; // Dark green background
    ctx.fillRect(0, healthBarY, canvas.width, barHeight);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = checkTargeting(enemy, player) ? '#FF0000' : '#00FF00'; // Red if vulnerable
    const healthWidth = (health / 100) * canvas.width;
    ctx.fillRect(0, healthBarY, healthWidth, barHeight);
    ctx.fillStyle = '#00FF00';
    ctx.fillText("Health", 10, healthBarY - 5); // Label above bar

    ctx.globalAlpha = 1.0; // Reset transparency
}

// Function to update fuel and health (placeholder, replace with game logic)
function updateHUD2Values(newFuel, newHealth) {
    fuel = Math.max(0, Math.min(100, newFuel)); // Clamp between 0 and 100
    health = Math.max(0, Math.min(100, newHealth)); // Clamp between 0 and 100
}
console.log("HUD2 loaded");
