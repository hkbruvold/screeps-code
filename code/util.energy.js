module.exports = {
    getSource: function(creep) {
        let mainsrc = creep.room.memory.mainsrc;
        // try to give one main container
        for (let i in mainsrc) {
            if (_.sum(Game.getObjectById(mainsrc[i]).store) >= creep.carryCapacity) {
                return Game.getObjectById(mainsrc[i]);
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
};