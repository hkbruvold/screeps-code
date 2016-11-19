/* This module contains functions for creeps to get task */
module.exports = {
    giveTask
};

function giveTask(creep, room) {
    /* Assign task to creep, meant to be used for new creeps */
    let type = creep.memory.type;
    if (type == "harvester") giveHarvesterTask(creep, room);
}

function giveHarvesterTask(creep, room) {
    /* Give the harvester a the task of the oldest harvester under 200 ticks*/

    if (!room.memory.harvesterTasks) {
        room.memory.harvesterTasks = {};
    }

    // Check for sources missing a harvester
    //let missingWorker = _.filter(room.memory.harvesterTasks, (sourceID) => (Game.getObjectById(sourceID.creepID) === null));
    let missingWorker = null;
    for (let sourceID in room.memory.harvesterTasks) {
        if (Game.getObjectById(room.memory.harvesterTasks[sourceID].creepID) === null) {
            missingWorker = sourceID;
            break;
        }
    }

    if (missingWorker) {
        creep.memory.task = {id: missingWorker};
        room.memory.harvesterTasks[missingWorker].creepID = creep.id;
        creep.memory.state = 2;
    } else {
        let harvesters = _.filter(Game.creeps, (creep) => (creep.memory.type == "harvester") &&
            (creep.memory.home == room.name) &&
            (creep.ticksToLive < 200) &&
            (!(creep.memory.replacing == true))
        );

        let sorted = _.sortBy(harvesters, function (item) {
            return item.ticksToLive;
        });

        if (sorted.length > 0) {
            sorted[0].memory.replacing = true;
            creep.memory.task = {id: sorted[0].memory.task.id, old: sorted[0].id};
            room.memory.harvesterTasks[sorted[0].memory.task.id].creepID = creep.id;
            creep.memory.state = 2;
        }
    }
}