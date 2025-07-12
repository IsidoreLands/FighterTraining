// js/platonic_aircraft.js - Modular params for platonic aircraft
const platonicParams = {
  baseThrust: 60000,
  afterburnerMultiplier: 2,
  baseDrag: 5000,
  dragCoefficient: 0.85,
  brakeDragAdd: 10000,
  turnDragAdd: 20000,
  weight: 1000,
  velocity: 160, // Baseline for ~5s cross on 800px canvas
  fuel: 60,
  maxFuel: 60,
  militaryBurn: 0.1,
  afterburnerBurn: 0.5,
  baseTurnSpeed: 0.06,
  turnSpeedABFactor: 0.8, // Reduces radius on AB
  turnSpeedBrakeFactor: 1.2 // Increases radius on brake
};
