function getSource(creep, priorityMain){
    
        let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return (resource.amount > 50); //creep.carryCapacity);
            }
        });
        if (dropped) {
            return dropped;
        }
    
    if (priorityMain) {
        let mainsrc = creep.room.memory.mainsrc;
        // try to give one main container
        if (mainsrc) {
            let maxsum = 0;
            let imin = 0;
            for (let i in mainsrc) {
                let cursum = _.sum(Game.getObjectById(mainsrc[i]).store);
                if (cursum > maxsum) {
                    maxsum = cursum;
                    imin = i;
                }
            }
            return Game.getObjectById(mainsrc[imin]);
        }
    } else {
        let src = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                        _.sum(structure.store) > 0;
            }
        });
        
        if (src){
            return src;
        } else {
            let dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (resource) => {
                    return (resource.amount > 50); //creep.carryCapacity);
                }
            });
            if (dropped) {
                return dropped;
            }
        }
    }
}

function getRegularStorage(creep) {
    let mainsrc = creep.room.memory.mainsrc;
    
    return creep.pos.findClosestByRange(STRUCTURE_CONTAINER,{
        filter: (structure) => {
            return (mainsrc.indexOf(structure.id) == -1) &&
                    (_.sum(structure.store) < structure.storeCapacity);
        }
    });
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
    pickupSource(creep) {pickupSource(creep)},
    getSource(creep) {getSource(creep)},
    getRegularStorage(creep) {getRegularStorage(creep)}
};