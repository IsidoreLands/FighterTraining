const AIRCRAFT_PROPERTIES = {
    "F-16": {
        baseWeight: 18000, 
        maxFuel: 7000,
        militaryThrust: 10000,
        afterburnerThrust: 28600,
        militaryBurn: 7.78, // Adjusted for ~2 min AB exhaustion
        afterburnerBurn: 58.33, // 7000 fuel / 120 seconds
        dragCoefficient: 0.85
    },
    "MiG-25": {
        baseWeight: 44000,
        maxFuel: 31900,
        militaryThrust: 20000,
        afterburnerThrust: 45000,
        militaryBurn: 245, // Proportional adjustment
        afterburnerBurn: 1837,
        dragCoefficient: 1.25 
    }
};
