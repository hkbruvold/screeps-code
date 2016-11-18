let mgrCreeps = require("mgr.creeps");

module.exports.loop = function () {
    safeMode(Game.spawns.Spawn1);
    mgrCreeps.runCreeps();

    let mainRoom = Game.spawns.Spawn1.room.name;
    if (Game.time % 100 == 0) {
        mgrCreeps.reset(mainRoom);
    }
};


function safeMode(spawner) {
    /* Will spawn one harvester and one upgrader one needed */
    if ((_.filter(Game.creeps, (creep) => creep.memory.role == "dedicatedharvester").length < 1) &&
        (_.filter(Game.creeps, (creep) => creep.memory.type == "safeharvester").length < 1)) {
        console.log("[SAFE MODE] Spawning safe mode harvester")
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], "SAFEMODE_HARVESTER", {type: "safeharvester", tiredCount: 0});
        return true;
    } else if (spawner.room.controller.ticksToDowngrade < 1500) {
        console.log("[SAFE MODE] Spawning safe mode upgrader")
        spawner.createCreep([WORK,MOVE,CARRY,MOVE], "SAFEMODE_UPGRADER", {type: "safeupgrader", tiredCount: 0});
        return true;
    } else {
        return false;
    }
}