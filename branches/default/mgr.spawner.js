/* This module handles spawning creeps */

/* Energy cost for body parts */
let energyCost = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
};

module.exports = {
    spawnNext, recalculateCapacity, fillSpawnQueue, addToQueue, sortBodyParts
};

function spawnNext(spawner) {
    /* Will spawn next creep in spawn queue if there are enough resources.
    *  Will also recalculate spawn energy capacity once in a while */
    let confCreeps = require("conf.creeps");
    let mgrDelegator = require("mgr.delegator");

    if (spawner.spawning) {
        return;
    }

    let spawnQueue = spawner.memory.spawnQueue;
    for (let i in spawnQueue) {
        if (spawnQueue[i].length > 0) {
            let creep = spawnQueue[i][0];
            let capacity = spawner.memory.capacity;
            let body = getBodyParts(confCreeps[creep].parts, capacity, confCreeps[creep].extend);
            let name = getName(creep);
            let result = spawner.createCreep(body, getName(creep), confCreeps[creep].memory);

            if (result == name) {
                console.log("["+spawner.name+"] creating new creep, "+name+", of type "+confCreeps[creep].memory.type);
                spawner.memory.spawnQueue[i].shift();
                Game.creeps[name].memory.born = Game.time;
                Game.creeps[name].memory.home = spawner.room.name;
                mgrDelegator.giveTask(Game.creeps[name], spawner.room);
            } else if (result == ERR_NOT_ENOUGH_ENERGY) {
                return;
            } else if (result == ERR_BUSY) {
                console.log("[FATAL] Spawner "+spawner.name+" tried to create creep while busy")
            } else if (result == ERR_NAME_EXISTS) {
                console.log("[FATAL] mgr.spawner.getName() returned name which is already in use")
            }
            return; // Return if creep was found
        }
    }
}

function addToQueue(room, creepType, checkMax) {
    /* Adds a creep of creepType to spawn queue 
     * If checkMax == true, the queue adding will not happen if enough creeps exist */
    let confRooms = require("conf.rooms");
    let confCreeps = require("conf.creeps");
    
    let priority = confCreeps[creepType].priority;
    let spawner = Game.spawns[confRooms[room.name].spawners[0]];
    
    if (checkMax) {
        let count = _.filter(Game.creeps, (creep) => (creep.memory.type == creepType &&
            creep.memory.home == spawner.room.name &&
            creep.ticksToLive > 500)).length;
        count = count*2; // To allow for all creeps to request a replacer
        let desiredCount = confRooms[spawner.room.name].creeps[creepType];
        if (desiredCount >= count) return;
    }


    spawner.memory.spawnQueue[priority].push(creepType);
}

function fillSpawnQueue(spawner) {
    /* Fill spawn queue with creeps that are missing and somehow has not a place in queue.
    *  Does currently not support more than one spawn per room (need to move spawn queue to room memory for that, possibly) */
    let confRooms = require("conf.rooms");
    let confCreeps = require("conf.creeps");

    let spawnQueue = spawner.memory.spawnQueue;

    for (let creepType in confCreeps) {
        let count = _.filter(Game.creeps, (creep) => (creep.memory.type == creepType &&
            creep.memory.home == spawner.room.name)).length;
        let desiredCount = confRooms[spawner.room.name].creeps[creepType];

        let delta = desiredCount - count;
        if (delta > 0) {
            let queued = 0;
            let priority = confCreeps[creepType].priority;
            for (let i in spawnQueue[priority]) {
                if (spawnQueue[priority][i] == creepType) {
                    queued++;
                }
            }
            if (delta > queued) {
                for (let i = 0; i < delta-queued; i++) {
                    spawner.memory.spawnQueue[priority].push(creepType);
                    spawner.memory.spawnQueueMisses += 1;
                }
            }
        }
    }
}

function sortBodyParts(bodyParts) {
    /* Will sort the body parts to move more important parts last */
    let count = { // works as counter and pirority list
        move: 0,
        work: 0,
        carry: 0,
        attack: 0,
        ranged_attack: 0,
        heal: 0,
        claim: 0,
        tough: 0
    };
    let priorityList = [TOUGH, WORK, CARRY, CLAIM, MOVE, ATTACK, RANGED_ATTACK, HEAL];

    // Count different body parts
    for (let part of bodyParts) {
        count[part]++;
    }

    let newlist = [];
    // Add parts in correct order
    for (let part of priorityList) {
        for (let i = 0; i < count[part]; i++) {
            newlist.push(part);
        }
    }

    return newlist;
}

function recalculateCapacity(spawner) {
    /* Recalculates a spawners energy capacity and stores it in its memory */
    let capacity = getEnergyCapacity(spawner);
    spawner.memory.capacity = capacity;
}

function getBodyParts(bodyPartList, eCap, extend) {
    /* Returns the list of body parts possible to create with eCap energy */

    let partsList = [];
    let spareEnergy = eCap;
    if (!extend) {
        spareEnergy = Math.min(getBodyPartCost(bodyPartList), eCap);
    } else {
        spareEnergy = eCap;
    }

    while (spareEnergy >= 0) {
        let nextPart = bodyPartList[partsList.length % bodyPartList.length];

        spareEnergy -= energyCost[nextPart];
        if (spareEnergy >= 0) {
            partsList.push(nextPart);
        } else {
            return partsList; // no more energy, returning
        }
    }
}

function getBodyPartCost(bodyPartList) {
    /* Returns cost of creating creep with body parts specified in bodyPartList */
    let totalCost = 0;

    for (let i in bodyPartList) {
        totalCost += energyCost[bodyPartList[i]];
    }

    return totalCost;
}

function getName(type) {
    /* Returns free name starting with type and ending with a number */

    let count = 1;
    while (count < 1000) {
        if (!Game.creeps[type+count]) {
            return type+count;
        }
        count++;
    }

    return undefined;
}

function getEnergyCapacity(spawner) {
    /* This function returns the energy capacity of the spawner */
    return getExtensionsCapacity(spawner) + spawner.energyCapacity;
}

function getExtensionsCapacity(spawner) {
    /* Returns energy capacity from extensions limited by controller level */
    let extensions = getExtensionsList(spawner);

    let cap = 50;
    let num = extensions.length;

    let controllerLevel = spawner.room.controller.level;

    switch (controllerLevel) {
        case 7: cap = 100; break;
        case 8: cap = 200; break;
        default: break;
    }

    return num*cap;
}

function getExtensionsList(spawner) {
    /* Returns list of extensions limited by the controller level */
    let extensions = spawner.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION);
        }
    });

    let num = extensions.length;
    let controllerLevel = spawner.room.controller.level;

    switch (controllerLevel) {
        case 1: num = 0; break;
        case 2: num = Math.min(num, 5); break;
        case 3: num = Math.min(num, 10); break;
        case 4: num = Math.min(num, 20); break;
        case 5: num = Math.min(num, 30); break;
        case 6: num = Math.min(num, 40); break;
        case 7: num = Math.min(num, 50); break;
        case 8: num = Math.min(num, 60); break;
        default: break;
    }

    return extensions.slice(0,num);
}