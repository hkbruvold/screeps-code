/* The worker does repair, building, and upgrading
 *  States:
 *  0 - just spawned
 *  1 - getting energy
 *  2 - doing work */
module.exports = {run};

function run(creep) {
    let utilMove = require("util.move");
    let utilEnergy = require("util.energy");
    let mgrDelegator = require("mgr.delegator");
    let mgrSpawner = require("mgr.spawner");

    if (creep.spawning) {
        creep.memory.energyTarget = "";
        creep.memory.workTarget = "";
        return;
    }

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
            let src = utilEnergy.getEnergy(creep);
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
        let workTarget = Game.getObjectById(creep.memory.workTarget);
        if (!workTarget) { // Need target
            let target = mgrDelegator.workerGetTask(creep, creep.room);

            if (target) {
                creep.memory.workTarget = target.id;
                workTarget = target;
            } else { // Delegator didn't have any tasks
                return;
            }
        }

        // Check if in range of work site
        if (creep.memory.role == "repairer") {
            if (creep.pos.inRangeTo(workTarget, 3)) {
                creep.repair(workTarget);
                if (creep.carry.energy === 0) creep.memory.state = 1;
                if (workTarget.hits == workTarget.hitsMax) { // Stop repairing when structure has full hits
                    creep.memory.workTarget = "";
                    creep.memory.path = null;
                }
                return;
            }
        } else if (creep.memory.role == "builder") {
            if (creep.pos.inRangeTo(workTarget, 3)) {
                creep.build(workTarget);
                if (creep.carry.energy === 0) creep.memory.state = 1;
                creep.memory.workTarget = "";
                creep.memory.path = null;
                return;
            }
        } else if (creep.memory.role == "upgrader") {
            if (creep.pos.inRangeTo(workTarget, 3)) {
                creep.upgradeController(workTarget);
                if (creep.carry.energy === 0) creep.memory.state = 1;
                creep.memory.workTarget = "";
                creep.memory.path = null;
                return;
            }
        }

        let moveResult = utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            utilMove.createPath(creep, workTarget.pos.x, workTarget.pos.y);
            utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != workTarget.pos.x || creep.memory.pathtarget.y != workTarget.pos.y) {
                // Need new path, shouldn't happen often
                utilMove.createPath(creep, workTarget.pos.x, workTarget.pos.y);
                utilMove.move(creep);
            }
        }
    }
}