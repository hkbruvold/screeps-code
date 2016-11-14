var utilEnergy = require('util.energy');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var didAction = false;
        
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvesting == true) {
            let src = utilEnergy.getSource(creep);
            if(creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
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
