/* The spawnfiller transports energy to spawn and extensions
 *  States:
 *  0 - just spawned
 *  1 - getting energy
 *  2 - filling spawn/extension
 *  3 - idle */
module.exports = {run};

function run(creep) {
    let utilMove = require("util.move");
    let utilEnergy = require("util.energy");
    let mgrSpawner = require("mgr.spawner");

    if (creep.spawning) {
        creep.memory.energyTarget = "";
        creep.memory.dumpTarget = "";
        return;
    }

    if (creep.ticksToLive <= creep.memory.deployTime) {
        mgrSpawner.addToQueue(creep.room, creep.memory.type);
    }

    if (creep.carry === creep.carryCapacity) {
        creep.memory.state = 2;
    }

    if (creep.carry === 0) {
        creep.memory.state = 1;
    }

    if (creep.memory.state === 1) { // Is most likely moving to energy
        let energyTarget = Game.getObjectById(creep.memory.energyTarget);
        if (!energyTarget) { // Need target
            let src = utilEnergy.getEnergy(creep);
            if (src) {
                creep.memory.energyTarget = src.id;
                energyTarget = src;
            } else { // No targets found
                return;
            }
        }

        if (creep.isNearTo(energyTarget)) {
            utilEnergy.takeEnergy(creep, energyTarget);
            creep.memory.state = 2;
            return;
        }
        let moveResult = utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y);
            utilMove.move(creep);
        }
    }

    else if (creep.memory.state === 2) {
        let dumpTarget = Game.getObjectById(creep.memory.dumpTarget);
        if (!dumpTarget) { // Need target
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target) {
                creep.memory.dumpTarget = target.id;
                dumpTarget = target;
            } else { // No targets found
                return;
            }
        }

        if (creep.isNearTo(dumpTarget)) {
            creep.transfer(dumpTarget, RESOURCE_ENERGY);
            creep.memory.state = 1;
            return;
        }
        let moveResult = utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y);
            utilMove.move(creep);
        }
    }
}

