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
        
        if (target) {
            creep.repair(target);
            if (target.hits < target.hitsMax) {
                needTarget = false;
            }
        }
        
        if (needTarget) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax);
                }
            });
            
            if (targets.length > 0) {
                creep.room.memory.repairTarget = targets[0].id;
            }
        }
    }
};

module.exports = roleTower;