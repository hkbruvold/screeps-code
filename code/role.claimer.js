var dest = "W46S68";

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != dest) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
        } else {
            creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = roleClaimer;