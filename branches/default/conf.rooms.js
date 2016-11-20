/* This module servers two purposes:
*  - Defines the rooms
*  - Defines name of spawners per room
*  - Contains definitions of the desired amount of creeps*/
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        creeps: {
            harvester: 2,
            spawnfiller: 2,
            worker: 1,
            transporter: 1,
            transporternoroad: 0,
            upgrader: 0,
            builder: 0,
            repairer: 0,
            claimer: 0,
            abroadworker: 2,
            roomdefender: 1,
        },
    },
    E46S63: {
        spawners: ["Spawn2"],
        creeps: {
            harvester: 2,
            spawnfiller: 0,
            worker: 0,
            transporter: 0,
            transporternoroad: 0,
            upgrader: 0,
            builder: 0,
            repairer: 0,
            claimer: 0,
            abroadworker: 0,
            roomdefender: 0,
        },
    },
};