var roleAssistant = require('role.upgrader');

var roleHarvester = {

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
            /*let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) { // priority picking up dropped energy
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else */{
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
                didAction = true;
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
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
            }
        }
        
        if (didAction == false) {
            //creep.moveTo(Game.flags["idle-area"]);
            roleAssistant.run(creep);
        }
    }
};

module.exports = roleHarvester;
