/* 
 * This module will automatically create creeps.
 * The creeps will automatically be given body parts that is possible to give
 * with the current energy capacity.
 */

function getEnergyCapacity(spawner) {
    /* This function returns the energy capacity of the spawner */
    var energyStructures = spawner.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
    });
    
    var eCap = spawner.energyCapacity; // 300 For standard spawn TODO: Add support for more spawns
    eCap += energyStructures[0].energyCapacity * energyStructures.length; // TODO: Add support for higher capacity extensions
    
    return eCap;
}

module.exports = {
    run(spawner) {
        console.log(getEnergyCapacity(spawner));
    }
};