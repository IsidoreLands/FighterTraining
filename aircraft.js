const AIRCRAFT_PROPERTIES = {
    "F-16": {
        baseWeight: 18000, 
        maxFuel: 7000,
        militaryThrust: 10000,
        afterburnerThrust: 28600,
        // UPDATED: Burn rates are now per-second for a ~2 minute game
        militaryBurn: 50,
        afterburnerBurn: 375,
        dragCoefficient: 0.85
    },
    "MiG-25": {
        baseWeight: 44000,
        maxFuel: 31900,
        militaryThrust: 20000,
        afterburnerThrust: 45000,
        // UPDATED: Burn rates are now per-second
        militaryBurn: 375,
        afterburnerBurn: 1837,
        dragCoefficient: 1.25 
    }
};
