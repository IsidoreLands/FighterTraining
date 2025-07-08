// energy_maneuverability.js - EM calculations for FighterTraining
class EnergyManeuverability {
  constructor(thrust, drag, weight, velocity, fuel, maxFuel, militaryBurn, afterburnerBurn, dragCoefficient, turnSpeed) {
    this.thrust = thrust; // Newtons
    this.drag = drag; // Newtons
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
    if (this.isTurning) this.drag += 15000;
  }
  updateVelocity(deltaTime) {
    this.thrust = this.isAfterburning ? this.thrust * 2 : this.thrust;
    const acceleration = (this.thrust - this.drag) / this.weight;
    this.velocity += acceleration * deltaTime;
    this.velocity = Math.max(50, Math.min(300, this.velocity));
  }
  update(deltaTime, inputs) {
    this.isAfterburning = inputs.isAfterburning || false;
    this.isBraking = inputs.isBraking || false;
    this.isTurning = inputs.isTurning || false;
    this.burnFuel(deltaTime);
    this.updateVelocity(deltaTime);
    this.gForce = this.calculateGForce();
  }
}
// Platonic aircraft for testing
// const platonic = new EnergyManeuverability(60000, 5000, 1000, 160, 60, 60, 0.1, 0.5, 0.85, 0.06);
