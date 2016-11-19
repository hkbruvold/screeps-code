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
    let mgrDelegator = require("mgr.delegator");
    let mgrSpawner = require("mgr.spawner");

    if (creep.spawning) {
        creep.memory.energyTarget = "";
        creep.memory.dumpTarget = "";
        return;
    }

    if (creep.ticksToLive <= creep.memory.deployTime) {
        mgrSpawner.addToQueue(creep.room, creep.memory.type);
    }

    if (_.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.state = 2;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = 1;
    }

    if (creep.memory.state === 1) { // Is most likely moving to energy
        let energyTarget = Game.getObjectById(creep.memory.energyTarget);
        if (!energyTarget) { // Need target
            let src = utilEnergy.getEnergy(creep);
            if (creep.memory.role === "transporter") {
                src = utilEnergy.
            }
            if (src) {
                creep.memory.energyTarget = src.id;
                energyTarget = src;
            } else { // No targets found
                return;
            }
        }

        if (creep.pos.isNearTo(energyTarget)) {
            utilEnergy.takeEnergy(creep, energyTarget);
            creep.memory.state = 2;
            creep.memory.energyTarget = "";
            creep.memory.path = null;
            return;
        }
        let moveResult = utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y);
            utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != energyTarget.pos.x || creep.memory.pathtarget.y != energyTarget.pos.y) {
                // Need new path, shouldn't happen often
                utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y);
                utilMove.move(creep);
            }
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
            } else { // Ask delegator for target
                target = mgrDelegator.spawnfillerGetAssistantTask(creep, creep.romm);
                if (target) {
                    dumpTarget = target;
                } else { // Delegator didn't have any tasks
                    return;
                }
            }
        }

        if (creep.pos.isNearTo(dumpTarget)) {
            creep.transfer(dumpTarget, RESOURCE_ENERGY);
            if (creep.carry.energy === 0) creep.memory.state = 1;
            creep.memory.dumpTarget = "";
            creep.memory.path = null;
            return;
        }

        let moveResult = utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y);
            utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != dumpTarget.pos.x || creep.memory.pathtarget.y != dumpTarget.pos.y) {
                // Need new path, shouldn't happen often
                utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y);
                utilMove.move(creep);
            }
        }
    }
}

