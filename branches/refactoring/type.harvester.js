/* The harvester moves to a source and mines energy
*  States:
*  0 - just spawned
*  1 - looking for task
*  2 - moving to task
*  3 - harvesting*/
module.exports = {run};

function run(creep) {
    let utilMove = require("util.move");

    if (!creep.memory.task) {
        creep.memory.task = {};
        creep.memory.state = 1;
    }

    if (!creep.room.memory.harvesterTasks) {
        creep.room.memory.harvesterTasks = {};
    }

    if (creep.spawning) {
        return;
    }

    if (creep.memory.state == 3) {
        creep.harvest(Game.getObjectById(creep.memory.task.id));
    } else if (creep.memory.state == 1) { // Looking for task
        if (!(id in creep.memory.task)) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: (source) => {
                    return !(source in creep.room.memory.harvesterTasks);
                }
            });
            creep.room.memory.harvesterTasks[source.id] = creep.id;
            creep.memory.task["id"] = source.id;
        }
        let source = Game.getObjectById(creep.memory.task.id);
        let result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else if (result == OK) {
            let myX = creep.pos.x;
            let myY = creep.pos.y;
            creep.memory.task.pos = {x: myX, y: myY};
            creep.room.memory.harvesterTasks[source.id].pos = {x: myX, y: myY};
        } else if (result == ERR_BUSY) {
            // possibly when still being spawned
        } else {
            console.log("[FATAL] Unexpected for harvester when looking for task. Error: "+result);
        }
    } else if (creep.memory.state = 2) { // Moving to work place
        let result = utilMove.move(creep);
        if (result == 4) {
            let taskpos = creep.memory.task.pos;
            utilMove.createPath(creep, taskpos.x, taskpos.y);
        } else if (result == 1) {
            creep.memory.state = 3;
            return;
        }
        if (old in creep.memory.task) {
            let oldCreep = Game.getObjectById(creep.memory.task.old);
            if (oldCreep) {
                if (creep.pos.isNearTo(oldCreep)) { // Can calculate time it took to get here
                    if (creep.memory.deployTime == 0) {
                        creep.memory.deployTime = Game.time - creep.memory.born;
                    }
                }
            }
        }
    }
}