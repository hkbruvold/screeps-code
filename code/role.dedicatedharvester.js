var roleDedicatedHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.memory.harvesting) {
            if (creep.carry.energy < 96) {
                creep.harvest(Game.getObjectById(creep.memory.src));
            } else {
                creep.transfer(Game.getObjectById(creep.memory.cnt), RESOURCE_ENERGY);
            }
        } else {
            creep.moveTo(creep.memory.myPlace.x, creep.memory.myPlace.y);
            if (creep.pos.x == creep.memory.myPlace.x && creep.pos.y == creep.memory.myPlace.y) {
                creep.memory.harvesting = true;
            }
        }
    }
};

module.exports = roleDedicatedHarvester;
