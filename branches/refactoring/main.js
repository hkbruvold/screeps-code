let mgrCreeps = require("mgr.creeps");

module.exports.loop = function () {
    let mainRoom = Game.spawns.Spawn1.room.name;
    if (Game.time % 100 == 0) {
        mgrCreeps.reset(mainRoom);
    }

    mgrCreeps.runCreeps();
};
