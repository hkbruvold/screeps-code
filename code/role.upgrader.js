

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
