/* This module contains room-specific configurations :
*  - Defines the rooms
*  - Defines name of spawners per room
*  - Defines the ids of towers per room
*  - Contains definitions of the desired amount of creeps
*  - Defines the amount of hits above minimum wall hits before the wall should be considered to be repaired (walluffer)*/
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        towers: ["582d7e71412cc5f63b55d3b2"], // tower IDs
        creeps: {
            harvester: 2,
            spawnfiller: 2,
            worker: 2,
            wallfixer: 1,
            transporter: 1,
            transporternoroad: 0,
            upgrader: 0,
            builder: 0,
            repairer: 0,
            claimer: 0,
            abroadworker: 2,
            roomdefender: 1,
        },
        wallbuffer: 2000,
    },
    E46S63: {
        spawners: ["Spawn2"],
        towers: [], // tower IDs
        creeps: {
            harvester: 2,
            spawnfiller: 0,
            worker: 1,
            wallfixer: 1,
            transporter: 0,
            transporternoroad: 0,
            upgrader: 0,
            builder: 0,
            repairer: 0,
            claimer: 0,
            abroadworker: 0,
            roomdefender: 0,
        },
        wallbuffer: 1000,
    },
};