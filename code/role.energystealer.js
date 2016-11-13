let home = "W46S67";
let dest = "W46S68";

var roleEnergyStealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let myPos = creep.room.name;
        
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if (creep.memory.harvesting == true) { // want to harvest
            if (myPos == dest) { // harvest from energy source
                let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } else { // go to destination room
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(dest)));
            }
        } else { // want to go home to empty inventory
            if (myPos == home) { // transfer energy to container
                let container = Game.structures["container"];
                if(creep.harvest(container) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else { // go to home room
                creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(home)));
            }
        }
    }
};

module.exports = roleEnergyStealer;