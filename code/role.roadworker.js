var roleAssistant = require('role.upgrader');
var utilEnergy = require('util.energy');

var roleRoadworker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let didAction = false;
        let target = Game.getObjectById(creep.memory.repairTarget);
        
        if (target == null) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax*3/4);
                }
            });
            
            if (targets.length > 0) {
                creep.memory.repairTarget = targets[0].id;
            }
        }
        
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvesting == true) {
            didAction = utilEnergy.pickupSource(creep);
        } else {
            if (target) {
                if(creep.repair(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                if (target.hits < target.hitsMax) {
                } else {
                    creep.memory.repairTarget = ""
                }
                didAction = true;
            }
        }
        
        if (didAction == false) {
            //creep.moveTo(Game.flags["idle-area"]);
            roleAssistant.run(creep);
        }
    }
};

module.exports = roleRoadworker;