var roleRoomer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let myPos = creep.room.name;
        let dest = creep.memory["room"];
        
        if (myPos == dest) {
            creep.moveTo(Game.flags["roomer"]);
        } else {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
        }
    }
};

module.exports = roleRoomer;