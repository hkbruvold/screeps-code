/* 
 * This module will automatically create creeps.
 * The creeps will automatically be given body parts that is possible to give
 * with the current energy capacity.
 */

/* Define body parts for creeps */
var builder = [WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE];


/* Energy cost for body parts */
var energyCost = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
};

function getEnergyCapacity(spawner) {
    /* This function returns the energy capacity of the spawner */
    var energyStructures = spawner.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
    });
    
    var eCap = spawner.energyCapacity; // TODO: Add support for more spawns
    eCap += energyStructures[0].energyCapacity * energyStructures.length; // TODO: Add support for higher capacity extensions
    
    return eCap;
}

function getBodyParts(bodyPartList, eCap) {
    /* Returns the list of body parts possible to create with eCap energy */
    
    var partsList = [];
    var spareEnergy = eCap;
    
    while (spareEnergy >= 0) {
        var nextPart = bodyPartList[partsList.length % bodyPartList.length];
        
        spareEnergy -= energyCost[nextPart];
        if (spareEnergy >= 0) {
            partsList.push(nextPart);
        } else {
            return partsList; // no more energy, returning
        }
    }
}

module.exports = {
    run(spawner) {
        var eCap = getEnergyCapacity(spawner);
        console.log(getBodyParts([WORK,MOVE], eCap));
    }
};