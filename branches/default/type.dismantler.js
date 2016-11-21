/* The dismantler dismantles the given target and stores the energy in a container
 * The target is manually given by the player via its memory
 *  States:
 *  0 - just spawned
 *  1 - dismantling
 *  2 - storing energy */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) return;

    if (_.sum(creep.carry) === creep.carryCapacity) {
        creep.memory.state = 2;
    }

    if (creep.carry.energy === 0) {
        creep.memory.state = 1;
    }

    if (creep.memory.state === 1) { // Is most likely moving to energy
        let dismantleTarget = Game.getObjectById(creep.memory.dismantleTarget);
        if (!dismantleTarget) { // Need target
            creep.say("me work?");
            return;
        }

        if (creep.pos.isNearTo(dismantleTarget)) {
            creep.dismantle(dismantleTarget);
            return;
        }
        let moveResult = tools.utilMove.move(creep);
        if (moveResult === 4 || moveResult === 1) { // Completed or non-existing
            tools.utilMove.createPath(creep, dismantleTarget.pos.x, dismantleTarget.pos.y, creep.memory.home);
            tools.utilMove.move(creep);
        } else if (moveResult === 2) {
            if (creep.memory.pathtarget.x != dismantleTarget.pos.x || creep.memory.pathtarget.y != dismantleTarget.pos.y) {
                // Need new path, shouldn't happen often
                tools.utilMove.createPath(creep, dismantleTarget.pos.x, dismantleTarget.pos.y, creep.memory.home);
                tools.utilMove.move(creep);
            }
        }
    }

    else if (creep.memory.state === 2) {
        let dumpTarget = Game.getObjectById(creep.memory.dumpTarget);
        if (!dumpTarget) { // Ask delegator for target
            let target = tools.mgrDelegator.dismantlerGetDumpTarget(creep, creep.room);

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
    }
}