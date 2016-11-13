

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var didAction = false;
        
        if (creep.memory.refueling == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.refueling = false;
        }
        
        if (creep.memory.refueling == false && creep.carry.energy == 0) {
            creep.memory.refueling = true;
        }
        
        if(creep.memory.refueling == true) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            didAction = true;
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            didAction = true;
        }
        
        if (didAction == false) {
            creep.moveTo(Game.flags["idle-area"]);
            //roleAssistant.run(creep);
        }
    }
};

module.exports = roleUpgrader;
