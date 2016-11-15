var roleRoomer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.name == "roomer1") {
            creep.memory["apath"] = ["W46S67","W46S68"];
        } else if (creep.name == "roomer2") {
            creep.memory["apath"] = ["W46S67","W47S67","W48S67"];
        } else if (creep.name == "roomer3") {
            creep.memory["apath"] = ["W46S67","W46S68","W46S69"];
        } else if (creep.name == "roomer4") {
            creep.memory["apath"] = ["W46S67","W47S67","W47S66","W48S66"];
        }
        let myPos = creep.room.name;
        let idest = creep.memory["apath"].indexOf(myPos) + 1;
        
        if (idest == creep.memory["apath"].length) { // if already there
            targets = creep.room.find(FIND_HOSTILE_CREEPS);
            
            if (targets.length > 0) {
                if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.moveTo(25,25);
            }
        } else {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.apath[idest])));
        }
    }
};

module.exports = roleRoomer;