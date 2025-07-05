// mig25_fighter.js

// --- Asset Pre-loader for MiG-25 ---
const mig25Img = new Image();
let mig25Loaded = false;

function mig25AssetLoaded() {
    mig25Loaded = true;
    if (f16Loaded && mig25Loaded) {
        startGame(); // Calls startGame from index.html when both images are loaded
    }
}

mig25Img.onload = mig25AssetLoaded;
mig25Img.src = 'MiG25_Enemy.png';

// --- MiG-25 Fighter Class ---
class MiG25Fighter {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.v = 2.5; // Current speed
        this.angle = -Math.PI / 2;
        this.rotation = 0;
        this.image = mig25Img; // MiG-25 image
        this.scale = scale; // Scale for the image
        this.turnSpeed = 0.06;
        this.minSpeed = 1.5;
        this.maxSpeed = 5;
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

        // Draw MiG-25 image if loaded
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
