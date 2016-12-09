/* This module contains functions for creeps to get task */
let confRooms = require("conf.rooms");
let utilEnergy = require("util.energy");

module.exports = {
    giveTask, harvesterGetTask, spawnfillerGetTask, workerGetTask, transporterGetSource, transporterGetTarget,
    abroadworkerGetTask, wallfixerGetTask, energystealerGetTask, dismantlerGetDumpTarget, remoteminerGetTask,
    reserverGetTask, giveAbroadworkerTask
};

function giveTask(creep, room) {
    /* Assign task or define memory for new creeps */
    let type = creep.memory.type;
    if (type == "harvester") {
        creep.memory.task = {};
    }
    else if (type == "abroadworker") {
        creep.memory.energyTarget = "";
        creep.memory.workTarget = "";
        creep.memory.workPath = [];
        creep.memory.workPath = giveAbroadworkerTask(creep, room);
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
    else if (type == "dismantler") {
        creep.memory.dismantleTarget = "";
        creep.memory.dumpTarget = "";
        creep.memory.dismantleYourself = false;
    }
    else if (type == "remoteminer") {
        creep.memory.targetRoom = [];
        creep.memory.task = {};
    }
    else if (type == "reserver") {
        creep.memory.targetPath = [];
    }
}

function giveAbroadworkerTask(creep, room) {
    /* Give the abroadworker a workRoom */
    let tasks = confRooms[room.name].abroadworkerpaths;
    let desiredTaskCount = confRooms[room.name].abroadworkercount;
    let taskCount = desiredTaskCount.slice(); // Copy array

    // Count number of stealers per path (a bit inefficient, but shouldn't be run often)
    let workers = _.filter(Game.creeps, (creep) => creep.memory.type == "abroadworker" && creep.memory.home == room.name);
    for (let worker of workers) {
        for (let i in tasks) {
            if (tasks[i][tasks[i].length-1] == worker.memory.workPath[worker.memory.workPath.length-1]) {
                taskCount[i]--;
            }
        }
    }

    // Return first path with missing stealer
    for (let i in taskCount) {
        if (taskCount[i] > 0) {
            return tasks[i];
        }
    }
    creep.say("need path");
    return []; // Return an empty array so that the creep will ask again
}

function harvesterGetTask(creep, roomname) {
    /* Give the harvester a the task of the oldest harvester under 200 ticks or a source if it's missing a harvester */

    if (!Memory.rooms[roomname].harvesterTasks) {
        Memory.rooms[roomname].harvesterTasks = {};
    }

    // Check for sources missing a harvester
    let source = null;
    for (let sourceID in Memory.rooms[roomname].harvesterTasks) {
        if (Game.getObjectById(Memory.rooms[roomname].harvesterTasks[sourceID].creepID) === null) {
            source = sourceID;
            break;
        }
    }

    if (!(source === null)) { // Give harvester the task to harvest the source with a missing harvester
        creep.memory.task = {id: source};
        Memory.rooms[roomname].harvesterTasks[source].creepID = creep.id;
        creep.memory.state = 2;
    } else { // Give the harvester the task of replacing the oldest creep
        let harvester = null;
        let minTicks = 200;
        for (let sourceID in Memory.rooms[roomname].harvesterTasks) {
            let curHarvester = Game.getObjectById(Memory.rooms[roomname].harvesterTasks[sourceID].creepID);
            if (curHarvester) {
                if (curHarvester.memory.state === 3 && !(curHarvester.memory.repairTarget === true)) {
                    if (curHarvester.ticksToLive < minTicks) {
                        minTicks = curHarvester.ticksToLive;
                        harvester = Game.getObjectById(curHarvester.id);
                    }
                }
            }
        }

        if (harvester) { // greater than 1 because it finds itself
            harvester.memory.replacing = true;
            creep.memory.task = {id: harvester.memory.task.id, old: harvester.id};
            Memory.rooms[roomname].harvesterTasks[harvester.memory.task.id].creepID = creep.id;
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
    let walllimit = confRooms[room.name].walllimit;
    let rampartlimit = confRooms[room.name].rampartlimit;

    // Find the wall/rampart closest to creep that has one of the lowest hits
    let structures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.hits <= walllimit && structure.structureType == STRUCTURE_WALL) ||
                (structure.hits <= rampartlimit && structure.structureType == STRUCTURE_RAMPART));
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
    let tasks = confRooms[room.name].stealerpaths;
    let desiredTaskCount = confRooms[room.name].stealercount;
    let taskCount = desiredTaskCount.slice(); // Copy array

    // Count number of stealers per path (a bit inefficient, but shouldn't be run often)
    let stealers = _.filter(Game.creeps, (creep) => creep.memory.type == "energystealer" && creep.memory.home == room.name);
    for (let stealer of stealers) {
        for (let i in tasks) {
            if (tasks[i][tasks[i].length-1] == stealer.memory.task[stealer.memory.task.length-1]) {
                taskCount[i]--;
            }
        }
    }

    // Return first path with missing stealer
    for (let i in taskCount) {
        if (taskCount[i] > 0) {
            return tasks[i];
        }
    }
    creep.say("need path");
    return []; // Return an empty array so that the creep will ask again
}

function dismantlerGetDumpTarget(creep, room) {
    /* Function to give the dismantler a target to dump its energy */
    // Check if some regular storage containers need filling
    let target = utilEnergy.getRegularStorage(creep);

    if (target) {
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
        return target;
    }
}

function remoteminerGetTask(creep, roomname) {
    /* Function to give the remoteminer a target room */
    let targetRoom = confRooms[roomname].remotemining[0];
    
    creep.memory.targetRoom = targetRoom;
}

function reserverGetTask(creep, roomname) {
    /* Function to give the remoteminer a target room */
    let targetPath = confRooms[roomname].reservepaths[0];

    creep.memory.targetPath = targetPath;
}