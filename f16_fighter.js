// f16_fighter.js

// --- Asset Pre-loader for F16 ---
const f16Img = new Image();
let f16Loaded = false;

function f16AssetLoaded() {
    f16Loaded = true;
    if (f16Loaded && mig25Loaded) {
        startGame(); // Calls startGame from index.html
    }
}

f16Img.onload = f16AssetLoaded;
f16Img.src = 'F16 Player.png'; // Matches the uploaded file with space

// --- F16 Fighter Class ---
class F16Fighter {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.v = 2.5; // Current speed
        this.angle = -Math.PI / 2;
        this.rotation = 0;
        this.image = f16Img; // F16 image
        this.scale = scale; // Scale for the image
        this.turnSpeed = 0.06;
        this.minSpeed = 1.5;
        this.maxSpeed = 5;
        this.isBraking = false;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        // Draw target cone ("the six")
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 90, Math.PI * 0.75, Math.PI * 1.25, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();

        // Draw F16 image if loaded
        const width = this.image.width * this.scale;
        const height = this.image.height * this.scale;
        if (this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(this.image, -width / 2, -height / 2, width, height);
        }

        ctx.restore();
    }

    update() {
        this.angle += this.rotation;
        const vx = Math.cos(this.angle) * this.v;
        const vy = Math.sin(this.angle) * this.v;
        
        this.x += vx;
        this.y += vy;

        // Screen wrapping
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}
