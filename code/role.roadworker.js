var roleAssistant = require('role.harvester');

var roleRoadworker = {

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
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            didAction = true;
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < structure.hitsMax*3/4;
                    }
            });
            
            if(targets.length > 0) {
                if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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

module.exports = roleRoadworker;