

module.exports.loop = function () {
    /* Get rooms defined in conf.rooms */
    let rooms = [];
    try {
        for (let roomname in tools.confRooms) {
            if (Game.rooms[roomname]) {
                rooms.push(Game.rooms[roomname]);
            } else {
                console.log("[ERROR] Unable to find room "+roomname+" which is specified in conf.rooms")
            }
        }
    } catch(error) {
        console.log("[FATAL] Error collecting rooms from conf.rooms");
        console.log(error.stack);
        return;
    }

    /* Run initial room configs for rooms not initialized (can be commented out to save CPU)*/
    try {
        for (let room of rooms) {
            if (room.memory.initialized != true) {
                tools.mgrMemory.initSpawnMemory(Game.spawns[tools.confRooms[room.name].spawners[0]]);
                tools.mgrSpawner.fillSpawnQueue(Game.spawns[tools.confRooms[room.name].spawners[0]]);
                tools.mgrSpawner.recalculateCapacity(Game.spawns[tools.confRooms[room.name].spawners[0]]);
                tools.mgrMemory.initHarvesterContainers(rooms[i]);
                room.memory.initialized = true;
            }
        }
    } catch(error) {
        console.log("[ERROR] Error running room initialization");
        console.log(error.stack);
    }

    /* Do some operations every tick */
    try {
        for (let i in rooms) {
            for (let j in tools.confRooms[rooms[i].name].towers) {
                typeTower.run(Game.getObjectById(tools.confRooms[rooms[i].name].towers[j]));
            }
        }
    } catch(error) {
        console.log("[ERROR] Error running tower script");
        console.log(error.stack);
    }

    /* Do some operations every 15 ticks */
    try {
        if (Game.time % 15 == 0) {
            for (let i in rooms) {
                tools.mgrSpawner.fillSpawnQueue(Game.spawns[tools.confRooms[rooms[i].name].spawners[0]]);
                tools.mgrSpawner.recalculateCapacity(Game.spawns[tools.confRooms[rooms[i].name].spawners[0]]);
                tools.mgrMemory.clearReservationMemory(rooms[i]);
                //tools.mgrMemory.initHarvesterContainers(rooms[i]); // Check for new harvester containers (can be commented out if not needed)
            }
            tools.mgrMemory.clearCreepMemory();
        }
    } catch(error) {
        console.log("[ERROR] Error executing 15 ticks functions");
        console.log(error.stack);
    }

    /* Spawn safemode harvester/upgrader if needed, otherwise spawn regular creeps */
    try {
        for (let i in rooms) {
            if (!safeMode(Game.spawns[tools.confRooms[rooms[i].name].spawners[0]])) {
                tools.mgrSpawner.spawnNext(Game.spawns[tools.confRooms[rooms[i].name].spawners[0]]);
            }
        }
    } catch(error) {
        console.log("[ERROR] Error executing spawn functions");
        console.log(error.stack);
    }

    /* Run creeps modules */
    tools.mgrCreeps.runCreeps(tools);
};

function safeMode(spawner) {
    /* Will spawn one harvester and one upgrader one needed */
    if ((_.filter(Game.creeps, (creep) => creep.memory.type == "safeharvester" && creep.memory.home == spawner.room.name).length < 1) &&
        ((_.filter(Game.creeps, (creep) => creep.memory.type == "harvester" && creep.memory.home == spawner.room.name).length < 1) ||
        (_.filter(Game.creeps, (creep) => creep.memory.type == "spawnfiller" && creep.memory.home == spawner.room.name).length < 1))) {
        console.log("["+spawner.name+"] Spawning safe mode harvester");
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], spawner.name+"_HARVESTER", {type: "safeharvester", home: spawner.room.name, tiredCount: 0, deployTime: 0});
        return true;
    } else if (spawner.room.controller.ticksToDowngrade < 1500) {
        console.log("["+spawner.name+"] Spawning safe mode upgrader");
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], spawner.name+"_UPGRADER", {type: "safeupgrader", home: spawner.room.name, tiredCount: 0, deployTime: 0});
        return true;
    } else {
        return false;
    }
}

const typeTower = require("type.tower");
const tools = { // Modules that should be passed to different modules
    confCreeps: require("conf.creeps"),
    confGame: require("conf.game"),
    confRooms: require("conf.rooms"),
    mgrCreeps: require("mgr.creeps"),
    mgrDelegator: require("mgr.delegator"),
    mgrSpawner: require("mgr.spawner"),
    mgrMemory: require("mgr.memory"),
    utilEnergy: require("util.energy"),
    utilMove: require("util.move"),
};
const creeptypes = { // Modules to the different creep types
    abroadworker: require("type.abroadworker"),
    claimer: require("type.claimer"),
    dismantler: require("type.dismantler"),
    energystealer: require("type.energystealer"),
    harvester: require("type.harvester"),
    remoteminer: require("type.remoteminer"),
    reserver: require("type.reserver"),
}