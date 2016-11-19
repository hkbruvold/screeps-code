/* This module contains functions to be used by creeps to find energy sources */
module.exports = {
    getClosestEnergyContainer, getHarvesterContainer, getRegularStorage, getDroppedResource, getEnergy
};

function getEnergy() {
    /* Returns an object to get energy from. Closest container prioritized*/
    if (src = getClosestEnergyContainer(creep)) {return src}
    if (src = getDroppedResource(creep)) {return src}
}

function getClosestEnergyContainer(creep) {
    /* Returns the closest energy container or storage */
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                _.sum(structure.store) > 50;
        }
    });
}

function getHarvesterContainer(creep) {
    /* Returns harvester container closest to creep with more than 50 energy */
    let containers = creep.room.memory.harvesterContainers;
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (_.sum(structure.store) > 50) &&
                (structure.structureType == STRUCTURE_CONTAINER) &&
                (containers.indexOf(structure.id) != -1);
        }
    });
}

function getRegularStorage(creep) {
    /* Returns other containers than harvester containers */
    let containers = creep.room.memory.harvesterContainers;
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (_.sum(structure.store) < structure.storeCapacity) &&
                (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                (containers.indexOf(structure.id) == -1);
        }
    });
}

function getDroppedResource(creep) {
    /* Returns dropped resource if not reserved */
    let remainingCapacity = creep.carryCapacity - creep.carry;
    let droppedmem = creep.room.memory.dropped;
    let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return (droppedmed.indexOf(resource.id) == -1 && resource.amount > 50) ||
                (droppedmem.indexOf(resource.id) >= -1 && resource.amount > droppedmem[droppedmem.indexOf(resource.id)]);
        }
    });
    if (dropped) {
        if (droppedmem.indexOf(dropped.id) == -1) {
            creep.room.memory.dropped[dropped.id] = remainingCapacity;
        } else {
            creep.room.memory.dropped[dropped.id] += remainingCapacity;
        }
    }
    return dropped;
}