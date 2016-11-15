var roleDedicatedHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.name == "dedicatedharvester1") {
            creep.memory.src = "57ef9efc86f108ae6e610383";
            creep.memory.myPlace = {x: 33, y: 5};
        } else if (creep.name == "dedicatedharvester2") {
            creep.memory.src = "57ef9efc86f108ae6e610384";
            creep.memory.myPlace = {x: 34, y: 15};
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
