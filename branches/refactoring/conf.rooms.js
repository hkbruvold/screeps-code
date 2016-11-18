/* This module servers two purposes:
*  - Defines the rooms
*  - Defines name of spawners per room
*  - Contains definitions of the desired amount of creeps*/
module.exports = {
    E46S62: {
        spawners: ["Spawn1"],
        creeps: {
            harvester: 2,
            transporter: 1,
            upgrader: 1,
            builder: 1,
            repairer: 1,
        },
    },
};