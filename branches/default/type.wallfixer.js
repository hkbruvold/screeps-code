/* The wallfixer fixes walls and ramparts
*  States:
*  0 - just spawned
*  1 - getting energy
*  2 - doing work */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) return;

    if (creep.ticksToLive == creep.memory.deployTime) {
        tools.mgrSpawner.addToQueue(Game.rooms[creep.memory.home], creep.memory.type, true);
    }

    if (_.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.state = 2;
        creep.memory.path = null;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = 1;
        creep.memory.path = null;
    }

    if (creep.memory.state === 1) { // Is most likely moving to energy
        let energyTarget = Game.getObjectById(creep.memory.energyTarget);
        if (!energyTarget) { // Need target
            let src = tools.utilEnergy.getEnergy(creep);
            if (src) {
                creep.memory.energyTarget = src.id;
                energyTarget = src;
            } else { // No targets found
                return;
            }
        }

        if (creep.pos.isNearTo(energyTarget)) {
            tools.utilEnergy.takeEnergy(creep, energyTarget);
            creep.memory.state = 2;
            creep.memory.energyTarget = "";
            creep.memory.path = null;
            return;
        }
        let moveResult = tools.utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            tools.utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.home);
            tools.utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != energyTarget.pos.x || creep.memory.pathtarget.y != energyTarget.pos.y) {
                // Need new path, shouldn't happen often
                tools.utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.home);
                tools.utilMove.move(creep);
            }
        }
    }

    else if (creep.memory.state === 2) {
        let workTarget = Game.getObjectById(creep.memory.workTarget);
        
        if (!workTarget) { // Need target
            let target = tools.mgrDelegator.wallfixerGetTask(creep, creep.room);
            
            if (target) {
                creep.memory.workTarget = target.id;
                workTarget = target;
            } else { // Delegator didn't have any tasks
                return;
            }
        }

        // Check if in range of work site
        if (creep.memory.role == "wallfixer") {
            if (creep.pos.inRangeTo(workTarget, 3)) {
                creep.repair(workTarget);
                if (creep.carry.energy === 0) creep.memory.state = 1;
                if (workTarget.hits >= creep.memory.repairTarget) { // Stop repairing when structure enough hits
                    creep.memory.workTarget = "";
                    creep.memory.path = null;
                }
                return;
            }
        } else if (creep.memory.role == "repairer") {
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

        let moveResult = tools.utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            tools.utilMove.createPath(creep, workTarget.pos.x, workTarget.pos.y, creep.memory.home);
            tools.utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != workTarget.pos.x || creep.memory.pathtarget.y != workTarget.pos.y) {
                // Need new path, shouldn't happen often
                tools.utilMove.createPath(creep, workTarget.pos.x, workTarget.pos.y, creep.memory.home);
                tools.utilMove.move(creep);
            }
        }
    }
}