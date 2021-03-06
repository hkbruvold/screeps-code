/* Contains data about creeps with type as key
* Required memory fields:
*  - type: used to identify the script that should be run for the creep
*  - home: used to identify what room the creep is tied to
*  - tiredCount: used to log the amount of ticks the creep couldn't move because of fatigue
*  - deployTime: used to estimate time for the creep to get to work place
*  - state: used to store creep state
* Other fields used:
*  - role: specifies the assistant role the creep is currently doing
* */
module.exports = {
    harvester: {
        /* harvester harvest energy from source and dumps it on the floor */
        parts: [MOVE,WORK,WORK,WORK,WORK,WORK],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "harvester", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 1, // priority is a number from 0 to 9 where 0 is highest priority
    },
    spawnfiller: {
        /* spawnfiller transports energy from containers to spawn or extensions */
        parts: [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "spawnfiller", home: "", tiredCount: 0, deployTime: 10, role: "", state: 0},
        priority: 1, // priority is a number from 0 to 9 where 0 is highest priority
    },
    worker: {
        /* worker upgrades controllers, builds, and repairs */
        parts: [MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "worker", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 3, // priority is a number from 0 to 9 where 0 is highest priority
    },
    transporter: {
        /* transporter transports energy from harvester container to central storage */
        parts: [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "transporter", home: "", tiredCount: 0, deployTime: 2, role: "", state: 0},
        priority: 2, // priority is a number from 0 to 9 where 0 is highest priority
    },
    transporternoroad: {
        /* transporternoroad is same as transporter, but designed to move quicker on plain */
        parts: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "transporter", home: "", tiredCount: 0, deployTime: 2, role: "", state: 0},
        priority: 2, // priority is a number from 0 to 9 where 0 is highest priority
    },
    claimer: {
        /* claimer moves to other rooms to claim the controller */
        parts: [MOVE,CLAIM,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "claimer", home: "", tiredCount: 0, deployTime: -1, state: 0},
        priority: 5, // priority is a number from 0 to 9 where 0 is highest priority
    },
    abroadworker: {
        /* abroadworker works in another room, but collect sources from home room */
        parts: [MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "abroadworker", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 4, // priority is a number from 0 to 9 where 0 is highest priority
    },
    roomdefender: {
        /* roomdefender attacks enemies in the room */
        parts: [MOVE,ATTACK,MOVE,TOUGH,MOVE,ATTACK,MOVE,TOUGH,MOVE,ATTACK,MOVE,TOUGH,MOVE,TOUGH,MOVE,HEAL,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,HEAL,MOVE,TOUGH],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "roomdefender", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 6, // priority is a number from 0 to 9 where 0 is highest priority
    },
    wallfixer: {
        /* wallfixer repairs walls/ramparts. It should be able to move fast on plains */
        parts: [MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "wallfixer", home: "", tiredCount: 0, deployTime: 2, role: "", state: 0},
        priority: 3, // priority is a number from 0 to 9 where 0 is highest priority
    },
    energystealer: {
        /* energystealer moves to another room and takes the energy there */
        parts: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "energystealer", home: "", tiredCount: 0, deployTime: 2, role: "", state: 0},
        priority: 6, // priority is a number from 0 to 9 where 0 is highest priority
    },
    dismantler: {
        /* dismantler dismantles structures */
        parts: [MOVE,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "dismantler", home: "", tiredCount: 0, deployTime: 2, role: "", state: 0},
        priority: 8, // priority is a number from 0 to 9 where 0 is highest priority
    },
    remoteminer: {
        /* remoteminer harvests energy in another room */
        parts: [MOVE,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "remoteminer", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 4, // priority is a number from 0 to 9 where 0 is highest priority
    },
    reserver: {
        /* remoteminer harvests energy in another room */
        parts: [MOVE,CLAIM,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "reserver", home: "", tiredCount: 0, deployTime: 2, state: 0},
        priority: 4, // priority is a number from 0 to 9 where 0 is highest priority
    },
};