let confRooms = require("conf.rooms");
let mgrCreeps = require("mgr.creeps");
let mgrSpawner = require("mgr.spawner");
let mgrMemory = require("mgr.memory");

module.exports.loop = function () {
    /* Get rooms defined in conf.rooms */
    let rooms = [];
    try {
        for (let roomname in confRooms) {
            rooms.push(Game.rooms[roomname]);
        }
    } catch(error) {
        console.log("[FATAL] Error collecting rooms from conf.rooms");
        console.log(error.stack);
        return;
    }

    /* Run initial room configs for rooms not initialized (can be commented out to save CPU)*/
    try {
        for (let i in rooms) {
            if (rooms[i].memory.initialized != true) {
                mgrMemory.initSpawnMemory(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
                mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
                mgrSpawner.recalculateCapacity(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
                mgrMemory.initHarvesterContainers(rooms[i]);
                rooms[i].memory.initialized = true;
            }
        }
    } catch(error) {
        console.log("[ERROR] Error running room initialization");
        console.log(error.stack);
    }

    /* Do some operations every 15 ticks */
    try {
        if (Game.time % 15 == 0) {
            for (let i in rooms) {
                mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
                mgrSpawner.recalculateCapacity(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
                mgrMemory.clearReservationMemory(rooms[i]);
                //mgrMemory.initHarvesterContainers(rooms[i]); // Check for new harvester containers (can be commented out if not needed)
            }
            mgrMemory.clearCreepMemory();
        }
    } catch(error) {
        console.log("[ERROR] Error executing 15 ticks functions")
        console.log(error.stack);
    }

    /* Spawn safemode harvester/upgrader if needed, otherwise spawn regular creeps */
    try {
        for (let i in rooms) {
            if (!safeMode(Game.spawns[confRooms[rooms[i].name].spawners[0]])) {
                mgrSpawner.spawnNext(Game.spawns[confRooms[rooms[i].name].spawners[0]]);
            }
        }
    } catch(error) {
        console.log("[ERROR] Error executing spawn functions")
        console.log(error.stack);
    }

    /* Run creeps modules */
    mgrCreeps.runCreeps();
};


function safeMode(spawner) {
    /* Will spawn one harvester and one upgrader one needed */
    if ((_.filter(Game.creeps, (creep) => creep.memory.type == "harvester" && creep.memory.home == spawner.room.name).length < 1) &&
        (_.filter(Game.creeps, (creep) => creep.memory.type == "safeharvester" && creep.memory.home == spawner.room.name).length < 1)) {
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