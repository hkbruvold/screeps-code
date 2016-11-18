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
        mgrInitmem.initDroppedMemory(Game.spawns.Spawn1.room);
        //mgrInitmem.initHarvesterContainers(Game.spawns.Spawn1.room);
    }

    let rooms = [];
    for (let roomname in confRooms) {
        rooms.push(Game.rooms[roomname]);
    }
    /* Safe spawner */
    safeMode(confRooms[rooms[0].name].spawners[0]);

    /* Run creeps modules */
    mgrCreeps.runCreeps();

    /* Spawn if needed */
    mgrSpawner.spawnNext(confRooms[rooms[0].name].spawners[0]);

    /* Do some operations every 1500 ticks */
    if (Game.time % 1500 == 0) {
        mgrSpawner.fillSpawnQueue(confRooms[rooms[0].name].spawners[0]);
        mgrMemory.clearCreepMemory();
        mgrInitmem.initDroppedMemory(rooms[0]);
    }
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