function getSource(creep){
    let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: (resource) => {
            return (resource.amount > 50); //creep.carryCapacity);
        }
    });
    if (dropped) {
        return dropped;
    }
    
    let mainsrc = creep.room.memory.mainsrc;
    // try to give one main container
    if (mainsrc) {
        for (let i in mainsrc) {
            if (_.sum(Game.getObjectById(mainsrc[i]).store) >= creep.carryCapacity) {
                return Game.getObjectById(mainsrc[i]);
            }
        }
    }
    
    let src = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(structure.store) > 0;
        }
    });
    
    return src;
}

function pickupSource(creep){
    let src = getSource(creep);
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
    pickupSource(creep) {pickupSource(creep)},
    getSource(creep) {getSource(creep)}
};