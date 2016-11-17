var home = "W46S67";
var dest = "W46S68";

var roleEnergyStealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if (creep.memory.harvesting == true) { // want to harvest
            let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) { // priority picking up dropped energy
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else { // harvest from energy source
                let sources = Game.rooms[dest].find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        } else { // want to go home to empty inventory
            let targets = Game.rooms[home].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                        _.sum(structure.store) < structure.storeCapacity;
                }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleEnergyStealer;