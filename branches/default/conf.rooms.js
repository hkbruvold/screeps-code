/* This module contains room-specific configurations :
*  - Defines the rooms
*  - Defines name of spawners per room
*  - Defines the ids of towers per room
*  - Contains definitions of the desired amount of creeps
*  - Defines the amount of hits above minimum wall hits before the wall should be considered to be repaired (walluffer)*/
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        towers: ["582d7e71412cc5f63b55d3b2", "5831d51e3b3158d14cff4157"], // tower IDs
        stealerpaths: [["E46S62", "E46S63"]],
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
            abroadworker: 1,
            roomdefender: 1,
            energystealer: 1,
        },
        wallbuffer: 2000,
    },
    E46S63: {
        spawners: ["Spawn2"],
        towers: [], // tower IDs
        stealerpaths: [],
        creeps: {
            harvester: 2,
            spawnfiller: 1,
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
            energystealer: 0,
        },
        wallbuffer: 1000,
    },
};