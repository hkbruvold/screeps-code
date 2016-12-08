/* The safeharvester is a dumb basic creep that will harvest or pick up energy and fill up the spawn or controller */
module.exports = {run};

function run(creep) {
    if (!("harvesting" in creep.memory)) {
        creep.memory.harvesting = true;
    }
    
    // If the creep ends up in another room (it did happen)
    if (creep.room.name != creep.memory.home) {
        creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(Game.rooms[creep.memory.home])));
        return;
    }

    if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvesting = false;
    }

    if (creep.memory.harvesting == false && creep.carry.energy == 0) {
        creep.memory.harvesting = true;
    }

    if(creep.memory.harvesting == true) {
        
        
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                    _.sum(structure.store) > 50;
            }
        });
        if (container) {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return;
        }
        
        let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return (resource.amount > 50);
            }
        });

        if (dropped) {
            if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped);
            }
            return;
        }
        
        let source = creep.pos.findClosestByRange(FIND_SOURCES);
        
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        return;
    } else {
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        });

        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

