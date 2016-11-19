let confRooms = require("conf.rooms");
let mgrCreeps = require("mgr.creeps");
let mgrSpawner = require("mgr.spawner");
let mgrInitmem = require("mgr.initmem");
let mgrMemory = require("mgr.memory");

module.exports.loop = function () {
    if (false) {
        mgrInitmem.initSources(Game.spawns.Spawn1);
        mgrInitmem.initSpawnMemory(Game.spawns.Spawn1);
        mgrInitmem.initRepairQueue(Game.spawns.Spawn1.room);
        mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
        //mgrInitmem.initHarvesterContainers(Game.spawns.Spawn1.room);
    }

    /* Do some operations every 1500 ticks */
    if (Game.time % 150 == 0) {
        mgrSpawner.fillSpawnQueue(Game.spawns[confRooms[rooms[0].name].spawners[0]]);
        mgrMemory.clearCreepMemory();
    }

    let rooms = [];
    for (let roomname in confRooms) {
        rooms.push(Game.rooms[roomname]);
    }
    /* Spawn safemode harvester/upgrader if needed, otherwise regular creeps */
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