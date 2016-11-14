function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


var roleTower = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.hits < structure.hitsMax*3/4);
                }
        });
        
        if(targets.length > 0) {
            creep.repair(targets[getRandomInt(0,targets.length)]);
        }
    }
};

module.exports = roleTower;