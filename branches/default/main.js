let confRooms = require("conf.rooms");
let mgrCreeps = require("mgr.creeps");
let mgrSpawner = require("mgr.spawner");
let mgrMemory = require("mgr.memory");

module.exports.loop = function () {
    /* Get rooms defined in conf.rooms */
    let rooms = [];
    for (let roomname in confRooms) {
        rooms.push(Game.rooms[roomname]);
    }

    /* Run initial room configs for rooms not initialized (can be commented out to save CPU)*/
    for (let i in rooms) {
        if (rooms[i].memory.initialized != true) {
            mgrMemory.initSpawnMemory(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
            mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
            mgrSpawner.recalculateCapacity(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
            mgrMemory.initHarvesterContainers(rooms[i]);
            rooms[i].memory.initialized = true;
        }
    }

    /* Do some operations every 15 ticks */
    if (Game.time % 15 == 0) {
        for (let i in rooms) {
            mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
            mgrSpawner.recalculateCapacity(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
            mgrMemory.initHarvesterContainers(rooms[i]); // Check for new harvester containers (can be commented out if not needed)
        }
        mgrMemory.clearCreepMemory();
    }

    /* Spawn safemode harvester/upgrader if needed, otherwise spawn regular creeps */
    if (!safeMode(Game.spawns[confRooms[rooms[0].name].spawners[0]])) {
        mgrSpawner.spawnNext(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
    }

    /* Run creeps modules */
    mgrCreeps.runCreeps();
};


function safeMode(spawner) {
    /* Will spawn one harvester and one upgrader one needed */
    if ((_.filter(Game.creeps, (creep) => creep.memory.type == "harvester").length < 1) &&
        (_.filter(Game.creeps, (creep) => creep.memory.type == "safeharvester").length < 1)) {
        console.log("[SAFE MODE] Spawning safe mode harvester");
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], "SAFEMODE_HARVESTER", {type: "safeharvester", home: spawner.room.name, tiredCount: 0, deployTime: 0});
        return true;
    } else if (spawner.room.controller.ticksToDowngrade < 1500) {
        console.log("[SAFE MODE] Spawning safe mode upgrader");
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], "SAFEMODE_UPGRADER", {type: "safeupgrader", home: spawner.room.name, tiredCount: 0, deployTime: 0});
        return true;
    } else {
        return false;
    }
}