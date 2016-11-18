/* This module handles spawning creeps */
module.exports = {

};

function spawnNext(spawner, creepList) {
    /* */
}

function getName(type) {
    /* Returns free name starting with type and ending with a number */

    let count = 1;
    while (count < 1000) {
        if (!Game.creeps[type+count]) {
            return type+count;
        }
        count++;
    }

    return undefined;
}
