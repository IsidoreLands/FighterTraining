// energy_maneuverability.js - EM calculations for FighterTraining
class EnergyManeuverability {
  constructor(params) {
    this.baseThrust = params.baseThrust;
    this.thrust = params.baseThrust;
    this.afterburnerLevel = 0; // 0-1 modulation
    this.brakeLevel = 0; // 0-1 modulation
    this.baseDrag = params.baseDrag;
    this.drag = params.baseDrag;
    this.dragCoefficient = params.dragCoefficient;
    this.brakeDragAdd = params.brakeDragAdd;
    this.turnDragAdd = params.turnDragAdd;
    this.weight = params.weight;
    this.velocity = params.velocity;
    this.fuel = params.fuel;
    this.maxFuel = params.maxFuel;
    this.militaryBurn = params.militaryBurn;
    this.afterburnerBurn = params.afterburnerBurn;
    this.baseTurnSpeed = params.baseTurnSpeed;
    this.turnSpeed = params.baseTurnSpeed;
    this.turnSpeedABFactor = params.turnSpeedABFactor;
    this.turnSpeedBrakeFactor = params.turnSpeedBrakeFactor;
    this.gForce = 1;
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
    const burnRate = this.militaryBurn + (this.afterburnerBurn - this.militaryBurn) * this.afterburnerLevel;
    this.fuel -= burnRate * deltaTime;
    this.weight -= burnRate * deltaTime;
    this.fuel = Math.max(0, this.fuel);
    this.weight = Math.max(this.maxFuel * 0.5, this.weight);
    this.drag = this.dragCoefficient * this.velocity * this.velocity;
    if (this.brakeLevel > 0) this.drag += this.brakeDragAdd * this.brakeLevel;
    if (this.isTurning) this.drag += this.turnDragAdd;
  }
  updateVelocity(deltaTime) {
    const acceleration = (this.thrust - this.drag) / this.weight * 10; // Amplified for visibility
    this.velocity += acceleration * deltaTime;
    if (this.afterburnerLevel > 0) this.velocity += 50 * this.afterburnerLevel * deltaTime; // Increased for speed up
    if (this.brakeLevel > 0) this.velocity -= 30 * this.brakeLevel * deltaTime; // Increased for slow down
    this.velocity = Math.max(40, Math.min(320, this.velocity)); // Lower min, higher max for range
    console.log("Velocity updated to", this.velocity, "with accel", acceleration);
  }
  updateTurnSpeed() {
    this.turnSpeed = this.baseTurnSpeed;
    if (this.afterburnerLevel > 0) this.turnSpeed *= this.turnSpeedABFactor; // Tighter radius
    if (this.brakeLevel > 0) this.turnSpeed *= this.turnSpeedBrakeFactor; // Wider radius
  }
  update(deltaTime, inputs) {
    this.isAfterburning = inputs.isAfterburning;
    this.isBraking = inputs.isBraking;
    this.isTurning = inputs.isTurning || false;
    if (this.isAfterburning) this.afterburnerLevel = Math.min(1, this.afterburnerLevel + deltaTime / 0.5); // Ramp up over 0.5s
    else this.afterburnerLevel = Math.max(0, this.afterburnerLevel - deltaTime / 0.5); // Ramp down
    if (this.isBraking) this.brakeLevel = Math.min(1, this.brakeLevel + deltaTime / 0.5);
    else this.brakeLevel = Math.max(0, this.brakeLevel - deltaTime / 0.5);
    this.thrust = this.baseThrust * (1 + this.afterburnerLevel);
    this.burnFuel(deltaTime);
    this.updateVelocity(deltaTime);
    this.updateTurnSpeed();
    this.gForce = this.calculateGForce();
  }
}
