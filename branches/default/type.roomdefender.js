/* The roomdefender moves to a room and attacks enemies */
module.exports = {run};

function run(creep) {
    if (creep.spawning) return;

    let targets = creep.room.find(FIND_HOSTILE_CREEPS);

    if (targets.length > 0) {
        if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    } else if (Game.flags[creep.name]) {
        creep.moveTo(Game.flags[creep.name]);
    } else {
        creep.say("flag?");
    }
}