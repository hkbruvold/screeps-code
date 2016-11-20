/* The harvester moves to a source and mines energy
*  States:
*  0 - just spawned
*  1 - looking for task
*  2 - moving to task
*  3 - harvesting */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) {
        if (!(creep.id===undefined)) {
            if (!("id" in creep.memory.task)) { // Get task from delegator if possible
                tools.mgrDelegator.harvesterGetTask(creep, creep.room);
            }
        }
        return;
    }

    if (creep.ticksToLive == creep.memory.deployTime) {
        tools.mgrSpawner.addToQueue(creep.room, creep.memory.type, true);
    }

    if (creep.memory.state == 3) { // Ready to harvest
        creep.harvest(Game.getObjectById(creep.memory.task.id));
        return;
    }

    if (!creep.memory.task) {
        creep.memory.task = {};
    }

    if (!("id" in creep.memory.task)) {
        creep.memory.state = 1;
        creep.say("Exploring");
    }

    if (creep.memory.state == 1) { // Looking for task
        if (!("id" in creep.memory.task)) { // Identify task
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: (source) => {
                    return !(source.id in creep.room.memory.harvesterTasks);
                }
            });
            if (source) {
                creep.room.memory.harvesterTasks[source.id] = {creepID: creep.id};
                creep.memory.task["id"] = source.id;
                creep.say("Found it");
            } else {
                tools.mgrDelegator.harvesterGetTask(creep, creep.room);
                if (!"id" in creep.memory.task) {
                    console.log("[FATAL] creep " + creep.name + " can't find any unclaimed sources.");
                    console.log("You probably have too many harvesters");
                } else {
                    creep.memory.state = 2;
                }
                return;
            }
        }

        let source = Game.getObjectById(creep.memory.task.id);
        let result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else if (result == OK) {
            let myX = creep.pos.x;
            let myY = creep.pos.y;
            creep.room.memory.harvesterTasks[source.id].pos = {x: myX, y: myY};
            creep.memory.state = 3;
            creep.say("Here");
        } else if (result == ERR_BUSY) {
            // possibly when still being spawned
        } else {
            console.log("[FATAL] Unexpected for harvester when looking for task. Error: "+result);
        }
    }

    else if (creep.memory.state = 2) { // Moving to work place
        let result = tools.utilMove.move(creep);
        if (result == 4) {
            let sourceID = creep.memory.task.id;
            let taskpos = creep.room.memory.harvesterTasks[sourceID].pos;
            tools.utilMove.createPath(creep, taskpos.x, taskpos.y, creep.memory.home);
        } else if (result == 1) {
            creep.memory.state = 3;
            creep.say("I'm here");
            if (creep.memory.deployTime == 2) {
                creep.memory.deployTime = Game.time - creep.memory.born;
            }
            return;
        }
        if ("old" in creep.memory.task) {
            let oldCreep = Game.getObjectById(creep.memory.task.old);
            if (oldCreep) {
                if (creep.pos.isNearTo(oldCreep)) { // Can calculate time it took to get here
                    creep.say("Waiting");
                    if (creep.memory.deployTime == 2) {
                        creep.memory.deployTime = Game.time - creep.memory.born;
                    }
                }
            }
        }
    }
}