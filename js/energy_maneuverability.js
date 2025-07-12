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
    this.weight = params.weight;
    this.velocity = params.velocity;
    this.fuel = params.fuel;
    this.maxFuel = params.maxFuel;
    this.militaryBurn = params.militaryBurn;
    this.afterburnerBurn = params.afterburnerBurn;
    this.baseTurnSpeed = params.baseTurnSpeed;
    this.turnSpeed = params.baseTurnSpeed;
    this.gForce = 1;
    this.isAfterburning = false;
    this.isBraking = false;
    this.isTurning = false;
  }
  calculatePs() {
    return ((this.thrust - this.drag) * this.velocity) / this.weight;
  }
  calculateNeutralPs() {
    return ((this.baseThrust - this.baseDrag) * this.velocity) / this.weight;
  }
  calculateGForce() {
    return (this.drag / (9.81 * this.weight)) + 1;
  }
  burnFuel(deltaTime) {
    const burnRate = this.militaryBurn + (this.afterburnerBurn - this.militaryBurn) * this.afterburnerLevel;
    this.fuel -= burnRate * deltaTime;
    this.weight -= burnRate * deltaTime;
    this.fuel = Math.max(0, this.fuel);
    this.weight = Math.max(this.maxFuel * 0.5, this.weight);
    this.drag = this.dragCoefficient * this.velocity * this.velocity;
    if (this.brakeLevel > 0) this.drag += 10000 * this.brakeLevel;
    if (this.isTurning) this.drag += 20000;
  }
  updateVelocity(deltaTime) {
    const acceleration = (this.thrust - this.drag) / this.weight;
    this.velocity += acceleration * deltaTime;
    if (this.afterburnerLevel > 0) this.velocity += 20 * this.afterburnerLevel * deltaTime;
    if (this.brakeLevel > 0) this.velocity -= 10 * this.brakeLevel * deltaTime;
    this.velocity = Math.max(50, Math.min(160, this.velocity));
  }
  updateTurnSpeed() {
    this.turnSpeed = this.baseTurnSpeed;
    if (this.afterburnerLevel > 0) this.turnSpeed *= 0.8; // Tighter radius
    if (this.brakeLevel > 0) this.turnSpeed *= 1.2; // Wider radius
  }
  update(deltaTime, inputs) {
    this.isAfterburning = inputs.isAfterburning;
    this.isBraking = inputs.isBraking;
    this.isTurning = inputs.isTurning || false;
    if (this.isAfterburning) this.afterburnerLevel = Math.min(1, this.afterburnerLevel + deltaTime / 0.5); // Ramp up over 0.5s
    else this.afterburnerLevel = Math.max(0, this.afterburnerLevel - deltaTime / 0.5); // Ramp down
    if (this.isBraking) this.brakeLevel = Math.min(1, this.brakeLevel + deltaTime / 0.5);
    else this.brakeLevel = Math.max(0, this.brakeLevel - deltaTime / 0.5);
    this.thrust = this.baseThrust * (1 + (this.afterburnerLevel));
    this.burnFuel(deltaTime);
    this.updateVelocity(deltaTime);
    this.updateTurnSpeed();
    this.gForce = this.calculateGForce();
  }
}
