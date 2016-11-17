var roleAssistant = require('role.upgrader');
var utilEnergy = require('util.energy');

var wallsize = 2000;

var roleRoadworker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let didAction = false;
        let targetID = creep.memory.repairTarget;
        
        if (targetID == null) {creep.memory.repairTarget = "";}
        
        if (targetID == "") {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType != STRUCTURE_WALL) && (structure.hits < structure.hitsMax*3/4)) ||
                           ((structure.structureType == STRUCTURE_WALL) && (structure.hits < wallsize));
                }
            });
            
            if (target) {
                creep.memory.repairTarget = target.id;
                targetID = target.id;
            }
        }
        var target = Game.getObjectById(targetID);
        
        if (creep.memory.harvesting == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting == false && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvesting == true) {
            didAction = utilEnergy.pickupSource(creep);
        } else {
            if (target) {
                if(creep.repair(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                if (target.hits < target.hitsMax) {
                    if (target.structureType == STRUCTURE_WALL) {
                        if (target.hits > wallsize + 5000) {
                            creep.say("Done!");
                            creep.memory.repairTarget = "";
                        }
                    }
                } else {
                    creep.say("Done")
                    creep.memory.repairTarget = "";
                }
                didAction = true;
            }
        }
        
        if (didAction == false) {
            //creep.moveTo(Game.flags["idle-area"]);
            roleAssistant.run(creep);
        }
    }
};

module.exports = roleRoadworker;