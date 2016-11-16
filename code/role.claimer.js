var dest = "W46S68";

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.name == "claimer1") {
            creep.memory["apath"] = ["E46S62","E46S63"];
        } 
        let myPos = creep.room.name;
        let idest = creep.memory["apath"].indexOf(myPos) + 1;
        
        if (idest == creep.memory["apath"].length) { // if already there
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.apath[idest])));
        }
    }
};

module.exports = roleClaimer;