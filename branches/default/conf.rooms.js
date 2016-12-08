/* This module contains room-specific configurations :
*  - spawners: Array of spawns in the room
*  - towers: Array of tower IDs in the room
*  - stealerpaths: Array of paths, where each path is an array of room names, used for energystealers
*  - stealercount: Array of the desired number of stealers per stealerpath
*  - remotemining: Array of paths, where each path is an array of room names, used for remoteminers (currently only supporting one path per room)
*  - remotemining: Array of paths, where each path is an array of room names, used for reservers (currently only supporting one path per room)
*  - creeps: Object containing the desired number of each creep type for the room
*  - wallbuffer: Number, the wallfixer chooses closest target with hits equal to minimum wall hits + wallbuffer
*  - walllimit: Number of the desired max hits on walls
*  - rampartlimit: Number of the desired max hits on ramparts */
module.exports = {
    E46S62: {
        spawners: ["Spawn1","Spawn4"],
        towers: ["582d7e71412cc5f63b55d3b2", "5831d51e3b3158d14cff4157", "5846af7dee8456ce3acfffcf"],
        stealerpaths: [["E46S62", "E46S61"],["E46S62", "E47S62"]],
        stealercount: [1,2],
        remotemining: [["E46S62", "E47S62"]],
        reservepaths: [["E46S62", "E47S62"]],
        creeps: {
            harvester: 2,
            spawnfiller: 2,
            worker: 3,
            wallfixer: 1,
            transporter: 1,
            transporternoroad: 0,
            claimer: 0,
            abroadworker: 2,
            roomdefender: 1,
            energystealer: 3,
            dismantler: 0,
            remoteminer: 1,
            reserver: 1,
        },
        wallbuffer: 2000,
        walllimit: 200000,
        rampartlimit: 200000,
    },
    E46S63: {
        spawners: ["Spawn2","Spawn5"],
        towers: ["5831f9989f18cf26542f4ef5", "5834b4bf669596b2313905fd","5849516ec81f11b87ff6fb7f"],
        stealerpaths: [["E46S63", "E47S63"]],
        stealercount: [3],
        remotemining: [["E46S63", "E47S63"]],
        reservepaths: [["E46S63", "E47S63"]],
        creeps: {
            harvester: 2,
            spawnfiller: 1,
            worker: 5,
            wallfixer: 1,
            transporter: 1,
            transporternoroad: 0,
            claimer: 0,
            abroadworker: 0,
            roomdefender: 0,
            energystealer: 3,
            dismantler: 0,
            remoteminer: 1,
            reserver: 1,
        },
        wallbuffer: 1000,
        walllimit: 200000,
        rampartlimit: 200000,
    },
    E45S62: {
        spawners: ["Spawn3"],
        towers: ["5846af56687fb17c3b289c84"],
        stealerpaths: [["E45S62", "E46S62"]],
        stealercount: [1],
        remotemining: [["E46S63", "E47S63"]],
        reservepaths: [["E46S63", "E47S63"]],
        creeps: {
            harvester: 2,
            spawnfiller: 2,
            worker: 3,
            wallfixer: 2,
            transporter: 0,
            transporternoroad: 0,
            claimer: 0,
            abroadworker: 0,
            roomdefender: 0,
            energystealer: 1,
            dismantler: 0,
            remoteminer: 0,
            reserver: 0,
        },
        wallbuffer: 2000,
        walllimit: 100000,
        rampartlimit: 100000,
    },
};