/* 
 * This module will automatically create creeps.
 * The creeps will automatically be given body parts that is possible to give
 * with the current energy capacity.
 */

/* Define amount of creeps per role */
var maxBuilderCount = 3;
var maxHarvesterCount = 4;
var maxUpgraderCount = 5;

/* Define body parts for creeps */
var builderParts = [MOVE,WORK,CARRY,WORK,WORK,CARRY,MOVE];
var harvesterParts = [MOVE,WORK,CARRY,WORK,CARRY,WORK,MOVE];
var upgraderParts = [MOVE,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,MOVE];

/* Define memory for creeps */
var builderMemory = {role: 'builder', building: false};
var harvesterMemory = {role: 'harvester'};
var upgraderMemory = {role: 'upgrader', upgrading: false};

/* Define lookup for creeps based on role */
var myCreeps = {
    builder: {maxCount: maxBuilderCount, parts: builderParts, memory: builderMemory},
    harvester: {maxCount: maxHarvesterCount, parts: harvesterParts, memory: harvesterMemory},
    upgrader: {maxCount: maxUpgraderCount, parts: upgraderParts, memory: upgraderMemory}
};

/* Define priority list for spawning creeps */
var priorityList = [myCreeps.harvester, myCreeps.upgrader, myCreeps.builder];

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

function getExtensionsList(spawner) {
    /* Returns list of extensions limited by the controller level */
    var extensions = spawner.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
    });
    
    num = extensions.length;
    var controllerLevel = spawner.room.controller.level;
    
    switch (controllerLevel) {
        case 1:
            num = 0;
            break;
        case 2:
            num = Math.min(num, 5);
            break;
        case 3:
            num = Math.min(num, 10);
            break;
        case 4:
            num = Math.min(num, 20);
            break;
        case 5:
            num = Math.min(num, 30);
            break;
        case 6:
            num = Math.min(num, 40);
            break;
        case 7:
            num = Math.min(num, 50);
            break;
        case 8:
            num = Math.min(num, 60);
            break;
        default:
            break;
    }
    
    return extensions.slice(0,num);
}

function getExtensionsCapacity(spawner) {
    /* Returns energy capacity from extensions limited by controller level */
    var extensions = getExtensionsList(spawner);
    
    var cap = 50;
    var num = extensions.length;
    
    var controllerLevel = spawner.room.controller.level;
    
    switch (controllerLevel) {
        case 7:
            cap = 100;
            break;
        case 8:
            cap = 200;
            break;
        default:
            break;
    }
    
    return num*cap;
}

function getEnergyCapacity(spawner) {
    /* This function returns the energy capacity of the spawner */
    return getExtensionsCapacity(spawner) + spawner.energyCapacity;
}

function getEnergy(spawner) {
    /* Returns current energy level of spawner plus extensions */
    var extensions = getExtensionsList(spawner);
    
    var curEnergy = spawner.energy;
    for (var i in extensions) {
        curEnergy += extensions[i].energy;
    }
    return curEnergy;
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

function getBodyPartCost(bodyPartList) {
    /* Returns cost of creating creep with body parts specified in bodyPartList */
    var totalCost = 0;
    
    for (var i in bodyPartList) {
        totalCost += energyCost[bodyPartList[i]];
    }
    
    return totalCost;
}

function getName(role) {
    /* Returns free name starting with role and ending with a number */
    
    var count = 1;
    while (count < 1000) {
        if (!Game.creeps[role+count]) {
            return role+count;
        }
        count++;
    }
    
    return undefined;
}

function spawnCreep(spawner) {
    /* 
     * Spawns first creep from priorityList that is needed if enough energy is available.
     * Will also clear memory of non-existing creeps if a creep was spawned.
     */
    
    for (var i in priorityList) {
        var currentCount = _.filter(Game.creeps, (creep) => creep.memory.role == priorityList[i].memory.role).length;
        if (currentCount < priorityList[i].maxCount) {
            var spawnerCapacity = getEnergyCapacity(spawner);
            var bodyParts = getBodyParts(priorityList[i].parts, spawnerCapacity);
            
            if (getBodyPartCost(bodyParts) <= getEnergy(spawner)) {
                // Clear memory
                for(var name in Memory.creeps) {
                    if(!Game.creeps[name]) {
                        delete Memory.creeps[name];
                        console.log('Clearing non-existing creep memory:', name);
                    }
                }
                
                var creepName = getName(priorityList[i].memory.role);
                var ret = spawner.createCreep(bodyParts, creepName, priorityList[i].memory);
                if (ret != creepName) {
                    // If it fails for some reason
                    console.log("[FATAL] Unable to create creep, error code: " + ret);
                    console.log("[FATAL] Spawning safe mode creeps")
                    if (_.filter(Game.creeps, (creep) => creep.memory.role == "harvester").length < 1) {
                        spawner.createCreep([WORK,MOVE,CARRY], "SAFEMODE_HARVESTER", {role: "harvester"});
                    } else if (_.filter(Game.creeps, (creep) => creep.memory.role == "upgrader").length < 1) {
                        spawner.createCreep([WORK,MOVE,CARRY], "SAFEMODE_UPGRADER", {role: "harvester", upgrading:false});
                    }
                }
            }
            return;
        }
    }
}

module.exports = {
    run(spawner) {
        spawnCreep(spawner);
    }
};