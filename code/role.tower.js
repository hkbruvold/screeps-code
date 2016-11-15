function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


var roleTower = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = Game.getObjectById(creep.room.memory.repairTarget);
        let needTarget = true;
        
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            
        if (hostiles.length > 0) {
            for (let t in hostiles) {
                for (let b in hostiles[t].body) {
                    if (hostiles[t].body[b].type == ATTACK || hostiles[t].body[b].type == RANGED_ATTACK) {
                        creep.attack(hostiles[t]);
                        return;
                    }
                }
            }
        }
        
        let ramparts = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < 5000);
            }
        });
        
        if (ramparts.length > 0) {
            creep.repair(ramparts[0]);
            return;
        }
        if (target) {
            creep.repair(target);
            if (target.hits < target.hitsMax*3/4) {
                needTarget = false;
            }
            if (target.structureType == STRUCTURE_WALL || target.structureType == STRUCTURE_RAMPART) {
                needTarget = true;
            }
        }
        
        if (needTarget) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax);
                }
            });
            
            if (targets.length > 0) {
                creep.room.memory.repairTarget = targets[getRandomInt(0,targets.length)].id;
            }
        }
    }
};

module.exports = roleTower;