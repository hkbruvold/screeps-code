/* This module contains functions to be used by creeps to find energy sources */
module.exports = {
    getClosestEnergyContainer, getHarvesterContainer, getRegularStorage, getDroppedResource, getEnergy, getEnergyDroppedPriority, takeEnergy
};

function getEnergy(creep) {
    /* Returns an object to get energy from. Closest container prioritized */
    if (src = getClosestEnergyContainer(creep)) {return src}
    if (src = getDroppedResource(creep)) {return src}
}

function getEnergyDroppedPriority(creep) {
    /* Returns an object to get energy from. Dropped resource prioritized */
    if (src = getDroppedResource(creep)) {return src}
    if (src = getClosestEnergyContainer(creep)) {return src}
}

function takeEnergy(creep, object) {
    /* Make creep execute the correct take command on object */
    if (object.resourceType == RESOURCE_ENERGY) { // If it's dropped energy
        return creep.pickup(object);
    } else {
        return creep.withdraw(object, RESOURCE_ENERGY);
    }
}

function reserve(object, amount) {
    /* Reserve collection of energy for the amount */
    if (!object.memory.reservation) object.memory.reservation = {};

    if (object.id in object.room.memory.reservation) {
        object.room.memory.reservation[object.id] += amount;
    } else {
        object.room.memory.reservation[object.id] = amount;
    }
}

function unReserve(object, amount) {
    /* Remove reservation on the object of given amount */
    if (!object.memory.reservation) object.memory.reservation = {};

    if (object.id in object.room.memory.reservation) {
        object.room.memory.reservation[object.id] -= amount;
    }
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
            return (resource.resourceType == RESOURCE_ENERGY) && ((droppedmed.indexOf(resource.id) == -1 && resource.amount > 50) ||
                (droppedmem.indexOf(resource.id) >= -1 && resource.amount > droppedmem[droppedmem.indexOf(resource.id)]));
        }
    });
    if (dropped) {
        reserve(dropped, remainingCapacity);
    }
    return dropped;
}