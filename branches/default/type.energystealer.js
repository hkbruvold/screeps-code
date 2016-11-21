/* The energystealer moves to another room, picks up energy and takes it home
 *  States:
 *  0 - just spawned
 *  1 - getting energy
 *  2 - returning */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) return;

    if (creep.ticksToLive == creep.memory.deployTime) {
        tools.mgrSpawner.addToQueue(Game.rooms[creep.memory.home], creep.memory.type, true);
    }

    if (creep.memory.task.length == 0) {
        creep.memory.task = tools.mgrDelegator.energystealerGetTask(creep, Game.rooms[creep.memory.home]);
    }

    if (_.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.state = 2;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = 1;
    }

    if (creep.memory.state === 1) { // Is most likely moving to energy
        // Check if in correct room
        if (creep.room.name == creep.memory.task[creep.memory.task.length -1]) {
            let energyTarget = Game.getObjectById(creep.memory.energyTarget);
            if (!energyTarget) { // Need target
                let src = tools.utilEnergy.getEnergyDroppedPriority(creep);
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
                tools.utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.task[creep.memory.task.length -1]);
                tools.utilMove.move(creep);
            } else if (moveResult === 2) {
                if (creep.memory.pathtarget.x != energyTarget.pos.x || creep.memory.pathtarget.y != energyTarget.pos.y) {
                    // Need new path, shouldn't happen often
                    tools.utilMove.createPath(creep, energyTarget.pos.x, energyTarget.pos.y, creep.memory.task[creep.memory.task.length -1]);
                    tools.utilMove.move(creep);
                }
            }
        } else { // Move to room
            let myPos = creep.room.name;
            let idest = creep.memory.task.indexOf(myPos) + 1;
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.task[idest])));
        }
    }

    else if (creep.memory.state === 2) {
        // Check if in correct room
        if (creep.room.name == creep.memory.task[0]) {
            let dumpTarget = Game.getObjectById(creep.memory.dumpTarget);
            if (!dumpTarget) { // Ask delegator for target
                let target = tools.mgrDelegator.transporterGetTarget(creep, Game.rooms[creep.memory.home]);

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

            let moveResult = tools.utilMove.move(creep);
            if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
                tools.utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y, creep.memory.home);
                tools.utilMove.move(creep);
            } else if (moveResult === 2) {
                if (creep.memory.pathtarget.x != dumpTarget.pos.x || creep.memory.pathtarget.y != dumpTarget.pos.y) {
                    // Need new path, shouldn't happen often
                    tools.utilMove.createPath(creep, dumpTarget.pos.x, dumpTarget.pos.y, creep.memory.home);
                    tools.utilMove.move(creep);
                }
            }
        } else { // Move to correct room
            let myPos = creep.room.name;
            let idest = creep.memory.task.indexOf(myPos) - 1;
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.task[idest])));
        }
    }

}