/* This module contains functions to manage creeps that exists */
module.exports = {
    reset, addCreep, removeCreep, getTypeCount, runCreeps
};

function reset(room) {
    /* Refresh the creep dictionary. This dictionary is mainly used to choose what needs to be spawned */
    let dict = {};
    for (let cname in Game.creeps) {
        if (Game.creeps[cname].memory.home == room.name) {
            let creepType = Game.creeps[cname].memory.type;
            if (dict[creepType]) {
                dict[creepType].push(Game.creeps[cname].id);
            } else {
                dict[creepType] = [Game.creeps[cname].id];
            }
        }
    }
    room.memory["creepdict"] = dict;
}

function addCreep(room, creep) {
    /* Add creep to creep dictionary */
    if (room.memory.creepdict[creep.memory.type]) {
        if (room.memory.creepdict[creep.memory.type].indexOf(creep.id) == -1) {
            room.memory.creepdict[creep.memory.type].push(creep.id);
        }
    } else {
        room.memory.creepdict[creep.memory.type] = [creep.id];
    }
}

function removeCreep(room, creep) {
    /* Remove creep from creep dictionary */
    if (room.memory.creepdict[creep.memory.type]) {
        room.memory.creepdict[creep.memory.type].splice(room.memory.creepdict[creep.memory.type].indexOf(creep.id), 1);
    }
}

function getTypeCount(room, type) {
    /* Return the number of creeps of type */
    if (room.memory.creepdict[type]) {
        return room.memory.creepdict[type].length;
    }
}

function runCreeps(tools, creeptypes) {
    /* Executes function to all creeps. */
    for (let name in Game.creeps) {
        try {
            creeptypes[Game.creeps[name].memory.type].run(Game.creeps[name], tools);
        } catch(error) {
            console.log("Error executing code for creep: " + name + " of type: " + Game.creeps[name].memory.type);
            console.log(error.stack);
        }
    }
}