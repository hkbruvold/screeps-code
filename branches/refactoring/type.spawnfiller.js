/* The spawnfiller transports energy to spawn and extensions
 *  States:
 *  0 - just spawned
 *  1 - getting energy
 *  2 - filling spawn/extension
 *  3 - idle */
module.exports = {run};

function run(creep) {
    let utilMove = require("util.move");
    let mgrSpawner = require("mgr.spawner");

    if (creep.spawning) return;

    if (creep.carry === creep.carryCapacity) {
        creep.memory.state = 2;
    }

    if (creep.carry === 0) {
        creep.memory.state = 1;
    }

    if (creep.memory.state === 1) {

    }
}

