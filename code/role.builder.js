var roleAssistant = require('role.upgrader');
var utilEnergy = require('util.energy');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var didAction = false;
        
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvesting == false) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                didAction = true;
            }
        } else {
            let src = utilEnergy.getSource(creep);
            if(creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
            }
            didAction = true;
        }
        
        if (didAction == false) {
            //creep.moveTo(Game.flags["idle-area"]);
            roleAssistant.run(creep);
        }
    }
};

module.exports = roleBuilder;