function getPickup(creep) {
    let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return (resource.amount > 50); //creep.carryCapacity);
        }
    });
    if (dropped) {
        return dropped;
    }
    return false;
}


function getClosestEnergyContainer(creep) {
    let src = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(structure.store) > 0;
        }
    });
    
    if (src){
        return src;
    }
    return false;
}

function getHarvesterStorage(creep) {
   let mainsrc = creep.room.memory.mainsrc;
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (_.sum(structure.store) > 0) &&
                    (structure.structureType == STRUCTURE_CONTAINER) &&
                    (mainsrc.indexOf(structure.id) != -1);
        }
    });
    return target; 
}

function getRegularStorage(creep) {
    let mainsrc = creep.room.memory.mainsrc;
    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (_.sum(structure.store) < structure.storeCapacity) &&
                    (structure.structureType == STRUCTURE_CONTAINER) &&
                    (mainsrc.indexOf(structure.id) == -1);
        }
    });
    return target;
}

function getSource(creep, priorityMain){
    if (priorityMain) {
        if (src = getPickup(creep)) {return src}
        if (src = getHarvesterStorage(creep)) {return src}
        if (src = getClosestEnergyContainer(creep)) {return src}
    } else {
        if (src = getClosestEnergyContainer(creep)) {return src}
        console.log("creep didn't find container")
        if (src = getPickup(creep)) {return src}
    }
}

function pickupSource(creep){
    if (creep.memory.role == "spawnfiller") {
        var src = getSource(creep, true);
    } else {
        var src = getSource(creep, false);
    }
    
    if (src == null) {
        return false;
    }
    
    if (src.resourceType == RESOURCE_ENERGY) {
        if(creep.pickup(src) == ERR_NOT_IN_RANGE) {
            creep.moveTo(src);
        }
    } else {
        if(creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(src);
        }
    }
    return true;
}

module.exports = {
    pickupSource(creep) {return pickupSource(creep)},
    getSource(creep) {return getSource(creep)},
    getRegularStorage(creep) {return getRegularStorage(creep)},
    getHarvesterStorage(creep) {return getHarvesterStorage(creep)}
};