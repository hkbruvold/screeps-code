/* 
 * This module will automatically create creeps.
 * The creeps will automatically be given body parts that is possible to give
 * with the current energy capacity.
 */

/* Define amount of creeps per role */
var maxBuilderCount = 3;
var maxHarvesterCount = 0;
var maxUpgraderCount = 2;
var maxRoadworkerCount = 1;
var maxEnergyStealerCount = 3;
var maxRoomerCount = 1;
var maxDedicatedHarvesterCount = 1;
var maxSpawnFillerCount = 2;

/* Define body parts for creeps */
var builderParts = [MOVE,WORK,CARRY,WORK,WORK,CARRY,MOVE];
var harvesterParts = [MOVE,WORK,CARRY,WORK,CARRY,WORK,MOVE];
var upgraderParts = [MOVE,CARRY,WORK];
var roadworkerParts = [MOVE,WORK,CARRY,CARRY,MOVE,WORK];
var energyStealerParts = [MOVE,CARRY,WORK,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY];
var roomerParts = [MOVE];
var dedicatedHarvesterParts = [MOVE,CARRY,WORK,WORK,WORK,WORK,WORK];
var spawnFillerParts = [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY];

/* Define memory for creeps */
var builderMemory = {role: 'builder', harvesting: true};
var harvesterMemory = {role: 'harvester', harvesting: true};
var upgraderMemory = {role: 'upgrader', harvesting: true};
var roadworkerMemory = {role: 'roadworker', harvesting: true};
var energyStealerMemory = {role: 'energystealer', harvesting: true};
var roomerMemory = {role: 'roomer', room: "W46S68"};
var dedicatedHarvesterMemory = {role: 'dedicatedharvester', harvesting: false, myPlace: {x: 32, y: 17}, src: "57ef9d2786f108ae6e60d577", cnt: "5829db93de2d8fc4201232e7"};
var spawnFillerMemory = {role: 'spawnfiller', refill: true, harvesting: true};

/* Define lookup for creeps based on role */
var myCreeps = {
    builder: {maxCount: maxBuilderCount, parts: builderParts, memory: builderMemory, staticParts: false},
    harvester: {maxCount: maxHarvesterCount, parts: harvesterParts, memory: harvesterMemory, staticParts: false},
    upgrader: {maxCount: maxUpgraderCount, parts: upgraderParts, memory: upgraderMemory, staticParts: false},
    roadworker: {maxCount: maxRoadworkerCount, parts: roadworkerParts, memory: roadworkerMemory, staticParts: true},
    energyStealer: {maxCount: maxEnergyStealerCount, parts: energyStealerParts, memory: energyStealerMemory, staticParts: false},
    roomer: {maxCount: maxRoomerCount, parts: roomerParts, memory: roomerMemory, staticParts: true},
    dedicatedHarvester:  {maxCount: maxDedicatedHarvesterCount, parts: dedicatedHarvesterParts, memory: dedicatedHarvesterMemory, staticParts: true},
    spawnFiller: {maxCount: maxSpawnFillerCount, parts: spawnFillerParts, memory: spawnFillerMemory, staticParts: true}
};

/* Define priority list for spawning creeps */
var priorityList = [myCreeps.spawnFiller, myCreeps.dedicatedHarvester, myCreeps.roomer, myCreeps.energyStealer, myCreeps.upgrader, myCreeps.builder, myCreeps.roadworker];

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
    let extensions = spawner.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION);
            }
    });
    
    let num = extensions.length;
    let controllerLevel = spawner.room.controller.level;
    
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
    let extensions = getExtensionsList(spawner);
    
    let cap = 50;
    let num = extensions.length;
    
    let controllerLevel = spawner.room.controller.level;
    
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
    let extensions = getExtensionsList(spawner);
    
    let curEnergy = spawner.energy;
    for (var i in extensions) {
        curEnergy += extensions[i].energy;
    }
    return curEnergy;
}

function getBodyParts(bodyPartList, eCap, staticParts) {
    /* Returns the list of body parts possible to create with eCap energy */
    
    let partsList = [];
    let spareEnergy = eCap;
    if (!staticParts) {
        spareEnergy = eCap;
    } else {
        spareEnergy = Math.min(getBodyPartCost(bodyPartList), eCap);
    }
    
    while (spareEnergy >= 0) {
        let nextPart = bodyPartList[partsList.length % bodyPartList.length];
        
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
    let totalCost = 0;
    
    for (let i in bodyPartList) {
        totalCost += energyCost[bodyPartList[i]];
    }
    
    return totalCost;
}

function getName(role) {
    /* Returns free name starting with role and ending with a number */
    
    let count = 1;
    while (count < 1000) {
        if (!Game.creeps[role+count]) {
            return role+count;
        }
        count++;
    }
    
    return undefined;
}

function safeMode(spawner) {
    /* Will spawn one harvester and one builder one one is missing */
    if (_.filter(Game.creeps, (creep) => creep.memory.role == "dedicatedharvester").length < 1) {
        console.log("[SAFE MODE] Spawning safe mode harvester")
        spawner.createCreep([WORK,MOVE,CARRY], "SAFEMODE_HARVESTER", harvesterMemory);
    } else if (_.filter(Game.creeps, (creep) => creep.memory.role == "upgrader").length < 1) {
        console.log("[SAFE MODE] Spawning safe mode upgrader")
        spawner.createCreep([WORK,MOVE,CARRY], "SAFEMODE_UPGRADER", upgraderMemory);
    }
}

function spawnCreep(spawner) {
    /* 
     * Spawns first creep from priorityList that is needed if enough energy is available.
     * Will also clear memory of non-existing creeps if a creep was spawned.
     */
    
    for (let i in priorityList) {
        let currentCount = _.filter(Game.creeps, (creep) => creep.memory.role == priorityList[i].memory.role).length;
        if (currentCount < priorityList[i].maxCount) {
            let spawnerCapacity = getEnergyCapacity(spawner);
            let bodyParts = getBodyParts(priorityList[i].parts, spawnerCapacity, priorityList[i].staticParts);
            
            if (getBodyPartCost(bodyParts) <= getEnergy(spawner)) {
                // Clear memory
                for(let name in Memory.creeps) {
                    if(!Game.creeps[name]) {
                        delete Memory.creeps[name];
                        console.log('Clearing non-existing creep memory:', name);
                    }
                }
                
                let creepName = getName(priorityList[i].memory.role);
                let ret = spawner.createCreep(bodyParts, creepName, priorityList[i].memory);
                if (ret != creepName) {
                    // If it fails for some reason
                    console.log("[FATAL] Unable to create creep, error code: " + ret);
                    safeMode(spawner);
                }
            }
            return;
        }
    }
}

module.exports = {
    run(spawner) {
        safeMode(spawner);
        spawnCreep(spawner);
    }
};