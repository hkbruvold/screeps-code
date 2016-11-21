/* This module contains room-specific configurations :
*  - spawners: Array of spawns in the room
*  - towers: Array of tower IDs in the room
*  - stealerpaths: Array of paths, where each path is an array of room names, used for energystealers
*  - creeps: Object containing the desired number of each creep type for the room
*  - wallbuffer: Number, the wallfixer chooses closest target with hits equal to minimum wall hits + wallbuffer
*  - walllimit: Number of the desired max hits on walls
*  - rampartlimit: Number of the desired max hits on ramparts */
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        towers: ["582d7e71412cc5f63b55d3b2", "5831d51e3b3158d14cff4157"],
        stealerpaths: [["E46S62", "E46S61"]],
        creeps: {
            harvester: 2,
            spawnfiller: 2,
            worker: 2,
            wallfixer: 2,
            transporter: 1,
            transporternoroad: 0,
            claimer: 0,
            abroadworker: 1,
            roomdefender: 0,
            energystealer: 2,
            dismantler: 0,
        },
        wallbuffer: 2000,
        walllimit: 150000,
        rampartlimit: 150000,
    },
    E46S63: {
        spawners: ["Spawn2"],
        towers: ["5831f9989f18cf26542f4ef5"],
        stealerpaths: [],
        creeps: {
            harvester: 2,
            spawnfiller: 1,
            worker: 3,
            wallfixer: 1,
            transporter: 0,
            transporternoroad: 0,
            claimer: 0,
            abroadworker: 0,
            roomdefender: 0,
            energystealer: 0,
            dismantler: 0,
        },
        wallbuffer: 1000,
        walllimit: 150000,
        rampartlimit: 150000,
    },
};