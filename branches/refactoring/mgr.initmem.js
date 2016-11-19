/* This module contains functions to generate memory that only needs to be set once */
module.exports = {
    initSources, initRepairQueue, initSpawnMemory, initDroppedMemory, initHarvesterContainers
};

function initSources(structure) {
    /* Creates a list of the energy sources in room sorted by distance from structure */
    let sourceList = [];
    let sources = structure.room.find(FIND_SOURCES);

    while (sourceList.length < sources.length) {
        let min = 1000;
        let imin = 0;
        for (let i in sources) {
            let range = structure.pos.getRangeTo(sources[i]);
            if (range < min && sourceList.indexOf(sources[i]) == -1) {
                min = range;
                imin = i;
            }
        }
        sourceList.push(sources[imin].id);
    }
    structure.room.memory.sources = sourceList;
}

function initDroppedMemory(room) {
    /* Creates an empty dictionary to store status of dropped resources */
    room.memory.dropped = {};
}

function initHarvesterContainers(room) {
    /* Creates an array of containers underneath harvesters */
    room.memory.harvesterContainers = [];

    for (let name in Game.creeps) {
        if (Game.creeps[name].memory.type == "harvester") {
            let container = _.filter(Game.creeps[name].pos.lookFor(LOOK_STRUCTURES), (structure) => (structure.structureType == STRUCTURE_CONTAINER));
            room.memory.harvesterContainers.push(container[0]);
        }
    }
}

function initRepairQueue(room) {
    /* Creates an empty list to be used as repair queue.
    *  The queue is stored in the room's memory */
    room.memory.repairQueue = [];
}

function initSpawnMemory(spawner) {
    /* Creates an empty list to be used as spawn queue.
     * The queue is prioritized from 0 to 9 where 0 is highest priority.
     * The queue is stored in the spawner's memory. */
    let mgrSpawner = require("mgr.spawner");
    spawner.memory.spawnQueue = [[],[],[],[],[],[],[],[],[],[]];
    spawner.memory.spawnQueueMisses = 0;
    spawner.memory.capacity = 300;
    mgrSpawner.recalculateCapacity(spawner);
}