/* This module contains functions to clean up in memory and initialize some memories */
module.exports = {
    clearCreepMemory, clearReservationMemory, initSources, initRepairQueue, initSpawnMemory, initHarvesterContainers
}

function clearCreepMemory() {
    /* Clears the memory of creeps that doesn't exist anymore */
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function clearReservationMemory(room) {
    /* Clears the reservation memory from the room */
    if (!room.memory.reservation) return;
    for (let memID in room.memory.reservation) {
        if (!Game.getObjectById(memID)) {
            delete room.memory.reservation[memID];
        }
    }
}

function initSources(structure) {
    /* Creates a list of the energy sources in room sorted by distance from structure
     * Currently not used to anything */
    let sourceList = [];
    let sources = structure.room.find(FIND_SOURCES);

    while (sourceList.length < sources.length) {
        let min = 1000;
        let imin = 0;
        for (let i in sources) {
            let range = structure.pos.getRangeTo(sources[i]);
            if (range < min && sourceList.indexOf(sources[i].id) == -1) {
                min = range;
                imin = i;
            }
        }
        sourceList.push(sources[imin].id);
    }
    structure.room.memory.sources = sourceList;
}

function initHarvesterContainers(room) {
    /* Creates an array of containers underneath harvesters */
    room.memory.harvesterContainers = [];

    for (let name in Game.creeps) {
        if (Game.creeps[name].memory.type == "harvester") {
            let container = _.filter(Game.creeps[name].pos.lookFor(LOOK_STRUCTURES), (structure) => (structure.structureType == STRUCTURE_CONTAINER && structure.room.name == room.name));
            if (container[0]) {
                room.memory.harvesterContainers.push(container[0].id);
            }
        }
    }
}

function initRepairQueue(room) {
    /* Creates an empty list to be used as repair queue.
     * The queue is stored in the room's memory
     * Currently not used */
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