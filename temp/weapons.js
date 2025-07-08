const WEAPONS = {
    "AIM-9_Sidewinder": { 
        type: 'missile', 
        name: 'AIM-9 Sidewinder',
        angle: 0.50, // Mid-width cone
        range: 160,  // Mid-range
        scoreValue: 1, 
        color: 'rgba(255, 255, 0, 0.05)' 
    },
    "R-40_Acrid": {
        type: 'missile',
        name: 'R-40 Acrid',
        angle: 0.35, // Narrower cone for long-range interceptor missile
        range: 250,  // Longest range
        scoreValue: 1,
        color: 'rgba(255, 165, 0, 0.05)'
    },
    "M61A1_Vulcan": { 
        type: 'gun', 
        name: 'M61A1 Vulcan',
        angle: 0.25, // Narrow gun cone
        range: 80,   // Shortest range
        scoreValue: 5, 
        color: 'rgba(255, 0, 0, 0.1)' 
    }
};

const DEFAULT_LOADOUTS = {
    "F-16": ["M61A1_Vulcan", "AIM-9_Sidewinder"],
    "MiG-25": ["R-40_Acrid"] // No gun
};
