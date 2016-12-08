/* The claimer moves to the room and claims the controller */
module.exports = {run};

function run(creep) {
    if (creep.spawning) return;

    if (creep.memory.roompath) {
        let myPos = creep.room.name;
        let idest = creep.memory["roompath"].indexOf(myPos) + 1;
        if (idest == creep.memory["roompath"].length) { // Has arrived at end
            creep.moveTo(creep.room.controller);
            //creep.claimController(creep.room.controller); //let's do this manually for now
        } else { // Move to next room
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.roompath[idest])));
        }
    } else {
        creep.memory.roompath = [creep.room.name];
    }
}