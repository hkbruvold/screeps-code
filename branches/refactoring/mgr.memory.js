/* This module contains different functions to clean up memory */
module.exports = {
    clearCreepMemory
}

function clearCreepMemory() {
    /* Clears the memory of creeps that doesn't exist anymore */
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}