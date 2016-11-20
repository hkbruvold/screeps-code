/* This module contains functions for creeps to get task */
module.exports = {
    giveTask, harvesterGetTask, spawnfillerGetTask, workerGetTask, transporterGetSource, transporterGetTarget, abroadworkerGetTask, wallfixerGetTask, energystealerGetTask
};

function giveTask(creep, room) {
    /* Assign task or define memory for new creeps */
    let type = creep.memory.type;
    if (type == "harvester") {
        if (!room.memory.harvesterTasks) {
            room.memory.harvesterTasks = {};
        }
        creep.memory.task = {};
        //giveHarvesterTask(creep, room);
    }
    else if (type == "abroadworker") {
        creep.memory.energyTarget = "";
        creep.memory.workTarget = "";
        giveAbroadworkerTask(creep, room);
    }
    else if (type == "worker") {
        creep.memory.energyTarget = "";
        creep.memory.workTarget = "";
    }
    else if (type == "transporter") {
        creep.memory.energyTarget = "";
        creep.memory.dumpTarget = "";
    }
    else if (type == "spawnfiller") {
        creep.memory.energyTarget = "";
        creep.memory.dumpTarget = "";
    }
    else if (type == "wallfixer") {
        creep.memory.energyTarget = "";
        creep.memory.workTarget = "";
        creep.memory.repairTarget = 0;
    }
    else if (type == "energystealer") {
        creep.memory.energyTarget = "";
        creep.memory.dumpTarget = "";
        creep.memory.task = [];
    }
}

function giveAbroadworkerTask(creep, room) {
    /* Give the abroadworker a workRoom */
    creep.memory.workRoom = "E46S63";
}

function harvesterGetTask(creep, room) {
    /* Give the harvester a the task of the oldest harvester under 200 ticks or a source if it's missing a harvester */

    // Check for sources missing a harvester
    for (let sourceID in room.memory.harvesterTasks) {
        if (Game.getObjectById(room.memory.harvesterTasks[sourceID].creepID) === null) {
            var source = sourceID;
            break;
        }
    }

    if (source === null) { // Give harvester the task to harvest the source with a missing harvester
        creep.memory.task = {id: source};
        room.memory.harvesterTasks[source].creepID = creep.id;
        creep.memory.state = 2;
    } else { // Give the harvester the task of replacing the oldest creep
        let harvester = null;
        let minTicks = 1500;
        for (let sourceID in room.memory.harvesterTasks) {
            let curHarvester = Game.getObjectById(room.memory.harvesterTasks[sourceID].creepID);
            if (curHarvester.memory.state === 3 && !(curHarvester.memory.repairTarget === true)) {
                if (curHarvester.ticksToLive < minTicks) {
                    minTicks = curHarvester.ticksToLive;
                    harvester = curHarvester.id;
                }
            }
        }

        if (harvester) { // greater than 1 because it finds itself
            harvester.memory.replacing = true;
            creep.memory.task = {id: harvester.memory.task.id, old: harvester.id};
            room.memory.harvesterTasks[harvester.memory.task.id].creepID = creep.id;
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
            structure.structureType != STRUCTURE_CONTROLLER &&
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
            return (structure.structureType == STRUCTURE_WALL ||
                structure.structureType == STRUCTURE_RAMPART);
        }
    });

    if (structures.length > 0) {
        let minHits = structures[0].hits;
        for (let i in structures) {
            if (structures[i].hits < minHits) {
                minHits = structures[i].hits;
            }
        }
    
        minHits += confRooms[room.name].wallbuffer; // The allowed hits in order to find next wall
    
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_WALL ||
                    structure.structureType == STRUCTURE_RAMPART) &&
                    structure.hits <= minHits &&
                    structure.structureType != STRUCTURE_CONTROLLER);
            }
        });
    
        if (target) {
            creep.memory.role = "wallfixer";
            creep.memory.repairTarget = minHits + confRooms[room.name].wallbuffer*1.5;
            return target;
        }
    }

    // If no walls/ramparts, give the wallfixer the task of a worker
    return workerGetTask(creep, room);
}

function energystealerGetTask(creep, room) {
    /* Function to give an energystealer a room to steal energy from */
    let confRooms = require("conf.rooms");

    let tasks = confRooms[room.name].stealerpaths;
    if (!Game.rooms[creep.memory.home].memory.stealerTasks) {
        Game.rooms[creep.memory.home].memory.stealerTasks = new Array(tasks.length).fill(0);
    }

    // Check that stealerTasks has enough entries
    let taskCount = Game.rooms[creep.memory.home].memory.stealerTasks;
    if (taskCount.length < tasks.length) {
        for (let i = taskCount.length; i < tasks.length; i++) {
            Game.rooms[creep.memory.home].memory.stealerTasks.push(0);
        }
    }

    // Get index of smallest number in array
    let imin = 0;
    let tmin = taskCount[0];
    for (let i in taskCount) {
        if (taskCount[i] < tmin) {
            tmin = taskCount;
            imin = i;
        }
    }

    if (tasks.length > 0) {
        return tasks[imin];
    }
}