/* The transporter transports energy from given source to given target
 *  States:
 *  0 - just spawned
 *  1 - getting energy
 *  2 - transporting to target*/
module.exports = {run};

function run(creep) {
    let utilMove = require("util.move");
    let utilEnergy = require("util.energy");
    let mgrDelegator = require("mgr.delegator");
    let mgrSpawner = require("mgr.spawner");

    if (creep.spawning) return;

    if (creep.ticksToLive == creep.memory.deployTime) {
        mgrSpawner.addToQueue(creep.room, creep.memory.type, true);
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
            let src = mgrDelegator.transporterGetSource(creep, creep.room);

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
            utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.home);
            utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != energyTarget.pos.x || creep.memory.pathtarget.y != energyTarget.pos.y) {
                // Need new path, shouldn't happen often
                utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.home);
                utilMove.move(creep);
            }
        }
    }

    else if (creep.memory.state === 2) {
        let dumpTarget = Game.getObjectById(creep.memory.dumpTarget);
        if (!dumpTarget) { // Ask delegator for target
            let target = mgrDelegator.transporterGetTarget(creep, creep.room);

            if (target) {
                creep.memory.dumpTarget = target.id;
                dumpTarget = target;
            } else { // Delegator didn't have any tasks
                return;
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
            utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y, creep.memory.home);
            utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != dumpTarget.pos.x || creep.memory.pathtarget.y != dumpTarget.pos.y) {
                // Need new path, shouldn't happen often
                utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y, creep.memory.home);
                utilMove.move(creep);
            }
        }
    }
}

