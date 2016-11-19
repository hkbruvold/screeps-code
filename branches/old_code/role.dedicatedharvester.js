var roleDedicatedHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.name == "dedicatedharvester2") {
            creep.memory.src = "57ef9e2e86f108ae6e60eeb5";
            creep.memory.myPlace = {x: 15, y: 4};
        } else if (creep.name == "dedicatedharvester1") {
            creep.memory.src = "57ef9e2e86f108ae6e60eeb6";
            creep.memory.myPlace = {x: 11, y: 10};
        }
        
        
        if (creep.memory.harvesting) {
            creep.harvest(Game.getObjectById(creep.memory.src));
        } else {
            creep.moveTo(creep.memory.myPlace.x, creep.memory.myPlace.y);
            if (creep.pos.x == creep.memory.myPlace.x && creep.pos.y == creep.memory.myPlace.y) {
                creep.memory.harvesting = true;
            }
        }
    }
};

module.exports = roleDedicatedHarvester;
