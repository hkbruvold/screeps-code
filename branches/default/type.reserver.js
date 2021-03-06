/* The reserver moves to the target room and start reserving the controller
 *  States:
 *  0 - just spawned
 *  1 - claiming */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) {
        if (!(creep.id === undefined)) {
            if (creep.memory.targetPath.length === 0) { // Get task from delegator if possible
                tools.mgrDelegator.reserverGetTask(creep, creep.room.name);
            }
        }
        return;
    }

    if (creep.ticksToLive == creep.memory.deployTime) {
        if (creep.room.controller.reservation.ticksToEnd < 2000) { // Set a special order of a creep with one more claim part
            Game.rooms[creep.memory.home].memory["SOreserver"] = [MOVE,MOVE,CLAIM,CLAIM];
        }
        tools.mgrSpawner.addToQueue(Game.rooms[creep.memory.home], creep.memory.type, true);
    }

    // Check if creep needs to go to target room
    if (creep.memory.targetPath[creep.memory.targetPath.length - 1] !== creep.room.name) {
        let myPos = creep.room.name;
        let idest = creep.memory.targetPath.indexOf(myPos) + 1;
        creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.targetPath[idest])));
        return;
    }

    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    } else if (creep.pos.isNearTo(creep.room.controller)) {
        if (creep.memory.deployTime == 2) {
            creep.memory.deployTime = Game.time - creep.memory.born;
        }
    }
}