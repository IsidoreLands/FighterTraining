// This file defines the core E-M properties for each aircraft.
// Values are derived from real-world data but are scaled for playability.

const AIRCRAFT_PROPERTIES = {
    "F-16": {
        // Weight is in abstract units. Ratio is what matters.
        baseWeight: 18000, 
        maxFuel: 7000,
        // Thrust values are scaled down but maintain a realistic ratio.
        militaryThrust: 10000,
        afterburnerThrust: 28600,
        // Burn rates are in units per second.
        militaryBurn: 50 / 60,
        afterburnerBurn: 375 / 60,
        // A simplified drag coefficient. Lower is better.
        dragCoefficient: 0.85
    },
    "MiG-25": {
        baseWeight: 44000,
        maxFuel: 31900,
        militaryThrust: 20000,
        afterburnerThrust: 45000,
        militaryBurn: 375 / 60,
        afterburnerBurn: 1837 / 60,
        // Higher drag coefficient reflects less aerodynamic design.
        dragCoefficient: 1.25 
    }
};
