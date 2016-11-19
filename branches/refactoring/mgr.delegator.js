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
    // Check for sources not given a harvester
    let oldWorker = null;
    let missingWorker = _.filter(room.memory.harvesterTasks, (sourceID) => (Game.getObjectById(sourceID.creepID) === null));
    console.log(missingWorker);
    return;
    if (missingWorker.length > 0) {

    } else {
        let harvesters = _.filter(Game.creeps, (creep) => (creep.memory.type == "harvester") &&
            (creep.memory.home == room.name) &&
            (creep.ticksToLive < 200) &&
            (!(creep.memory.replacing == true))
        );

        let sorted = _.sortBy(harvesters, function (item) {
            return item.ticksToLive;
        });

        oldWorker = sorted[0];
    }
    oldWorker.memory.replacing = true;
    creep.memory.task = {id: sorted[0].memory.task.id, old: sorted[0].id};
    room.memory.harvesterTasks[sorted[0].memory.task.id].creepID = creep.id;
}