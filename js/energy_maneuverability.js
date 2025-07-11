// energy_maneuverability.js - EM calculations for FighterTraining
class EnergyManeuverability {
  constructor(thrust, drag, weight, velocity, fuel, maxFuel, militaryBurn, afterburnerBurn, dragCoefficient, turnSpeed) {
    this.baseThrust = thrust; // Base thrust without afterburner
    this.thrust = thrust; // Current thrust
    this.baseDrag = drag; // Base drag
    this.drag = drag; // Current drag
    this.weight = weight; // kg
    this.velocity = velocity; // pixels/s (scaled for gameplay)
    this.fuel = fuel; // kg
    this.maxFuel = maxFuel; // kg
    this.militaryBurn = militaryBurn; // kg/s
    this.afterburnerBurn = afterburnerBurn; // kg/s
    this.dragCoefficient = dragCoefficient; // dimensionless
    this.turnSpeed = turnSpeed; // rad/s
    this.gForce = 1; // g
    this.isAfterburning = false;
    this.isBraking = false;
    this.isTurning = false;
  }
  calculatePs() {
    return ((this.thrust - this.drag) * this.velocity) / this.weight; // pixels/s^2
  }
  calculateNeutralPs() {
    // No inputs: base thrust, base drag (no added turn/brake), current velocity/weight
    return ((this.baseThrust - this.baseDrag) * this.velocity) / this.weight;
  }
  calculateGForce() {
    return (this.drag / (9.81 * this.weight)) + 1; // g-force from drag + baseline
  }
  burnFuel(deltaTime) {
    const burnRate = this.isAfterburning ? this.afterburnerBurn : this.militaryBurn;
    this.fuel -= burnRate * deltaTime;
    this.weight -= burnRate * deltaTime;
    this.fuel = Math.max(0, this.fuel);
    this.weight = Math.max(this.maxFuel * 0.5, this.weight);
    this.drag = this.dragCoefficient * this.velocity * this.velocity;
    if (this.isBraking) this.drag += 10000;
    if (this.isTurning) this.drag += 20000; // Increased for more Ps drop
  }
  updateVelocity(deltaTime) {
    const acceleration = (this.thrust - this.drag) / this.weight;
    this.velocity += acceleration * deltaTime;
    if (this.isAfterburning) this.velocity += 20 * deltaTime; // Increased boost for visibility
    if (this.isBraking) this.velocity -= 10 * deltaTime; // Direct penalty for visibility
    this.velocity = Math.max(50, Math.min(160, this.velocity)); // Cap at 160 pixels/s
  }
  update(deltaTime, inputs) {
    this.isAfterburning = inputs.isAfterburning || false;
    this.isBraking = inputs.isBraking || false;
    this.isTurning = inputs.isTurning || false;
    this.thrust = this.isAfterburning ? this.baseThrust * 2 : this.baseThrust;
    this.burnFuel(deltaTime);
    this.updateVelocity(deltaTime);
    this.gForce = this.calculateGForce();
  }
}
