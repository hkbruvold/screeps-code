/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.roadworker');
 * mod.thing == 'a thing'; // true
 */

var roleRoadworker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var didAction = false;
        
        if (creep.memory.refueling == true && creep.carry.energy == creep.carryCapacity) {
            creep.memory.refueling = false;
        }
        
        if (creep.memory.refueling == false && creep.carry.energy == 0) {
            creep.memory.refueling = true;
        }
        
        if(creep.memory.refueling == true) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            didAction = true;
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD) &&
                            structure.hits < structure.hitsMax;
                    }
            });
            
            if(targets.length > 0) {
                if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                didAction = true;
            }
        }
        
        if (didAction == false) {
            creep.moveTo(Game.flags["idle-area"]);
        }
    }
};

module.exports = roleRoadworker;