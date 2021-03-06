/* The safeupgrader is a dumb basic creep that will harvest or pick up energy and upgrade the controller */
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
            let source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    } else {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}