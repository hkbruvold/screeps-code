/* Contains data about creeps with type as key
* Required memory fields:
*  - type: used to identify the script that should be run for the creep
*  - home: used to identify what room the creep is tied to
*  - tiredCount: used to log the amount of ticks the creep couldn't move because of fatigue
*  - deployTime: used to estimate time for the creep to get to work place
* Other fields used:
*  - task: defines the current task for the creep, is usually set by mgr.delegator
*  - role: specifies the assistant role the creep is currently doing
* */
module.exports = {
    harvester: {
        /* harvester harvest energy from source and dumps it on the floor */
        parts: [MOVE,WORK,WORK,WORK,WORK,WORK],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "harvester", home: "", tiredCount: 0, deployTime: 0, task: ""},
        priority: 1, // priority is a number from 0 to 9 where 0 is highest priority
    },
    transporter: {
        /* transporter transports energy from harvester container to central storage */
        parts: [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "transporter", home: "", tiredCount: 0, deployTime: 0, role: "", task: ""},
        priority: 2, // priority is a number from 0 to 9 where 0 is highest priority
    },
    transporternoroad: {
        /* transporternoroad is same as transporter, but designed to move quicker on plain */
        parts: [MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "transporter", home: "", tiredCount: 0, deployTime: 0, role: "", task: ""},
        priority: 2, // priority is a number from 0 to 9 where 0 is highest priority
    },
    upgrader: {
        /* upgrader upgrades controller */
        parts: [MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "upgrader", home: "", tiredCount: 0, deployTime: 0, task: ""},
        priority: 3, // priority is a number from 0 to 9 where 0 is highest priority
    },
    builder: {
        /* builder constructs structures */
        parts: [MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "builder", home: "", tiredCount: 0, deployTime: 0, role: "", task: ""},
        priority: 3, // priority is a number from 0 to 9 where 0 is highest priority
    },
    repairer: {
        /* repairer repairs structures */
        parts: [MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,MOVE,MOVE,WORK,CARRY,],
        extend: false, // whether the parts list should be looped. Recommended: false
        memory: {type: "repairer", home: "", tiredCount: 0, deployTime: 0, role: "", task: ""},
        priority: 3, // priority is a number from 0 to 9 where 0 is highest priority
    },
};