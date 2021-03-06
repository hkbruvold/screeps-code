/* This module servers two purposes:
*  - Defines the rooms
*  - Defines name of spawners per room
*  - Contains definitions of the desired amount of creeps*/
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        creeps: {
            harvester: 1,
            spawnfiller: 1,
            worker: 0,
            transporter: 0,
            transporternoroad: 0,
            upgrader: 0,
            builder: 0,
            repairer: 0,
        },
    },
};