var roleAssistant = require('role.upgrader');
var utilEnergy = require('util.energy');

var roleSpawnFiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let didAction = false;
        
        if (creep.memory.refill == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.refill = false;
        }
        
        if (creep.memory.refill == false && creep.carry.energy == 0) {
            creep.memory.refill = true;
        }
        
        if(creep.memory.refill == true) {
            didAction = utilEnergy.pickupSource(creep);
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                didAction = true;
            } else {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    didAction = true;
                }
            }
        }
        
        if (didAction == false) {
            creep.moveTo(Game.flags["idle-area"]);
            //roleAssistant.run(creep);
        }
    }
};

module.exports = roleSpawnFiller;