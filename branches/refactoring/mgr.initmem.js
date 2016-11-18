/* This module contains functions to generate memory that only needs to be set once */
module.exports = {
    initSources, initRepairQueue, initSpawnQueue
};

function initSources(structure) {
    /* Creates a list of the energy sources in room sorted by distance from structure */
    let sourceList = [];
    let sources = sturcture.room.find(FIND_SOURCES);
    let min = 1000;
    let imin = 0;
    while (sourceList.length < sources.length) {
        for (let i in sources) {
            let range = structure.pos.getRangeTo(sources[i]);
            if (range < min) {
                min = range;
                imin = i;
            }
        }
        sourceList.push(sources[imin]);
    }
}

function initRepairQueue(room) {
    /* Creates an empty list to be used as repair queue.
    *  The queue is stored in the room's memory */
    room.memory.repairQueue = [];
}

function initSpawnQueue(spawner) {
    /* Creates an empty list to be used as spawn queue.
     * The queue is prioritized from 0 to 9 where 0 is highest priority.
     * The queue is stored in the spawner's memory. */
    spawner.memory.spawnQueue = [[],[],[],[],[],[],[],[],[],[]];
}