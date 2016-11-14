var roleAssistant = require('role.upgrader');

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
            var sources = creep.room.find(FIND_SOURCES, {
                filter: (source) => {
                    return (source.energy > 0);
                }
            });
            if (sources.length > 0) {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            _.sum(structure.store) > 0;
                    }
                });
                
                if(containers.length > 0) {
                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                }
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