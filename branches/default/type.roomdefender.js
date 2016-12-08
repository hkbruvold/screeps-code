/* The roomdefender moves to a room and attacks enemies */
module.exports = {run};

function run(creep, tools) {
    if (creep.spawning) return;

    let whitelist = tools.confGame.whitelist;

    let hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (creep) => {
            return (whitelist.indexOf(creep.owner.username) == -1);
        }
    });

    if (hostile) {
        if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile);
        }
    } else if (creep.hits < creep.hitsMax){
        creep.heal(creep);
    } else if (Game.flags[creep.name]) {
        creep.moveTo(Game.flags[creep.name]);
    } else {
        creep.say("flag?");
    }
}