/* This module contains functions for creeps to get task */
module.exports = {
    giveTask, spawnfillerGetTask, workerGetTask, transporterGetSource, transporterGetTarget, abroadworkerGetTask, wallfixerGetTask
};

function giveTask(creep, room) {
    /* Assign task to creep, meant to be used for new creeps */
    let type = creep.memory.type;
    if (type == "harvester") giveHarvesterTask(creep, room);
    if (type == "abroadworker") giveAbroudworkerTask(creep, room);
}

function giveAbroudworkerTask(creep, room) {
    /* Give the abroudworker a workRoom */
    creep.memory.workRoom = "E46S63";
}

function giveHarvesterTask(creep, room) {
    /* Give the harvester a the task of the oldest harvester under 200 ticks */
    if (!room.memory.harvesterTasks) {
        room.memory.harvesterTasks = {};
    }

    // Check for sources missing a harvester
    let missingWorker = null;
    for (let sourceID in room.memory.harvesterTasks) {
        if ((!Game.creeps[room.memory.harvesterTasks[sourceID].creepName]) ||
            (room.memory.harvesterTasks[sourceID].creepName == creep.name)) {
            missingWorker = sourceID;
            break;
        }
    }

    if (missingWorker) { // Give harvester the task to harvest the source with a missing harvester
        creep.memory.task = {id: missingWorker};
        room.memory.harvesterTasks[missingWorker].creepName = creep.name;
        creep.memory.state = 2;
    } else { // Give the harvester the task of replacing the oldest creep
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
            room.memory.harvesterTasks[sorted[0].memory.task.id].creepName = creep.name;
            creep.memory.state = 2;
        }
    }
}

function spawnfillerGetTask(creep, room) {
    /* Function to give spawnfiller a task */
    // Check if spawn or extensions need energy
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity;
        }
    });

    if (target) {
        creep.memory.role = "spawnfiller";
        return target;
    }

    // Check for towers
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    });

    if (target) {
        creep.memory.role = "towerfiller";
        return target;
    }

    // Check if some regular storage containers need filling
    let utilEnergy = require("util.energy");
    target = utilEnergy.getRegularStorage(creep);

    if (target) {
        creep.memory.role = "transporter";
        return target;
    }
}

function workerGetTask(creep, room) {
    /* Function to give a worker a task */
    // Check if something needs repair
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_RAMPART &&
            structure.hits <= structure.hitsMax*3/4);
        }
    });

    if (target) {
        creep.memory.role = "repairer";
        return target;
    }

    // Check for construction sites
    target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    if (target) {
        creep.memory.role = "builder";
        return target;
    }

    // Give the worker the task of upgrading the controller
    creep.memory.role = "upgrader";
    return creep.room.controller;
}

function abroadworkerGetTask(creep, room) {
    /* Function to give an abroudworker a task */
    // Check if something needs repair
    let target = room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_RAMPART &&
            structure.structureType != STRUCTURE_CONTROLLER &&
            structure.hits <= structure.hitsMax*3/4);
        }
    });

    if (target) {
        creep.memory.role = "repairer";
        return target;
    }

    // Check for construction sites
    target = room.controller.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    if (target) {
        creep.memory.role = "builder";
        return target;
    }

    // Give the worker the task of upgrading the controller
    creep.memory.role = "upgrader";
    return room.controller;
}

function transporterGetSource(creep, room) {
    /* Function to give energy source for the transporter */
    // Check for harvester storage
    let utilEnergy = require("util.energy");
    let target = utilEnergy.getHarvesterStorage(creep);

    if (target) {
        return target;
    }

    target = utilEnergy.getDroppedResource(creep);

    if (target) {
        return target;
    }
}

function transporterGetTarget(creep, room) {
    /* Function to give the transporter a target */
    // Check if some regular storage containers need filling
    let utilEnergy = require("util.energy");
    let target = utilEnergy.getRegularStorage(creep);

    if (target) {
        creep.memory.role = "transporter";
        return target;
    }

    // Check if spawn or extensions need energy
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity;
        }
    });

    if (target) {
        creep.memory.role = "spawnfiller";
        return target;
    }

    // Check for towers
    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    });

    if (target) {
        creep.memory.role = "towerfiller";
        return target;
    }
}

function wallfixerGetTask(creep, room) {
    /* Function to give the wallfixer a target */
    let confRooms = require("conf.rooms");
    // Find the wall/rampart closest to creep that has one of the lowest hits
    let structures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_WALL &&
                structure.structureType == STRUCTURE_RAMPART);
        }
    });

    let minHits = structures[0].hits;
    for (let i in structures) {
        if (structures[i].hits < minHits) {
            minHits = structures[i].hits;
        }
    }

    minHits += confRooms[room.name].wallbuffer; // The allowed hits in order to find next wall

    let target = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_WALL &&
                structure.structureType == STRUCTURE_RAMPART &&
                structure.hits <= minHits);
        }
    });

    if (target) {
        creep.memory.role = "wallfixer";
        creep.memory.repairTarget = target.hits + minHits*1.5;
        return target;
    }

    // If no walls/ramparts, give the wallfixer the task of a worker
    return workerGetTask(creep, room);
}