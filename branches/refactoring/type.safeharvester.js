/* The safeharvester is a dumb basic creep that will harvest or pick up energy and fill up the spawn or controller */
module.exports = {run};

function run(creep) {
    if (!creep.memory.harvesting) {
        creep.memory.harvesting = true;
    }

    if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvesting = false;
    }

    if (creep.memory.harvesting == false && creep.carry.energy == 0) {
        creep.memory.harvesting = true;
    }

    if(creep.memory.harvesting == true) {
        let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return (resource.amount > 50);
            }
        });
        if (dropped) {
            if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped);
            }
        } else {
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
            } else {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
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
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

