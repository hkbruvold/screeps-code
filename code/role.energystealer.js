let dest = "W46S68";

var roleEnergyStealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != dest) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
        } else {
            creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = roleEnergyStealer;