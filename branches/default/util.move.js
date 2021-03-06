/* This module contains functions to help creeps create paths and follow them */
module.exports = {
    createPath, move
};

function createPath(creep, x, y, roomname) {
    /* Creates a path from creep to target that the creep can follow by using move()
     * If room is specified, it will go to the room first */
    creep.memory.path = creep.pos.findPathTo(x, y);
    creep.memory.pathprog = 0;
    creep.memory.pathtarget = {x: x, y: y};
    if (roomname) {
        creep.memory.pathtarget["room"] = roomname;
    } else {
        creep.memory.pathtarget["room"] = creep.room.name;
    }
}

function move(creep) {
    /* Move the creep along the created path. Will regenerate path if hindered.
    *  Return codes:
    *  0 - OK.
    *  1 - path completed.
    *  2 - had to create new path, started moving on the new path.
    *  3 - is tired.
    *  4 - creep memory does not contain path.*/
    let path = creep.memory.path;
    let pathprog = creep.memory.pathprog;
    let pathtarget = creep.memory.pathtarget;

    // Return 4 if no path exist
    if (!path || !pathtarget) return 4;

    // If in wrong room, or about to leave target room
    if (creep.room.name != pathtarget.room || (creep.room.name == pathtarget.room &&
        (creep.pos.y === 0 || creep.pos.y === 49 || creep.pos.x === 0 || creep.pos.x === 49))) {
        creep.moveTo(Game.rooms[pathtarget.room].controller);

        return 4;
    }
    
    if (pathprog > path.length) return 4;
    
    // Check if last move went fine or if it's wise to regenerate path
    if (pathprog) {
        if (!(creep.pos.x == path[pathprog-1].x && creep.pos.y == path[pathprog-1].y) || (pathprog > 5)) {
            // Generate new path to target
            let target = creep.memory.pathtarget;
            creep.memory.path = creep.pos.findPathTo(target.x, target.y);
            creep.memory.pathprog = 1;
            creep.move(path[0].direction);

            return 2;
        }
    }

    // Return 1 if path is done
    if (path.length == pathprog) return 1;


    let res = creep.move(path[pathprog].direction);
    if (res == OK) {
        creep.memory.pathprog = pathprog + 1;
        return 0;
    } else if (res == ERR_TIRED) {
        if (creep.memory.tiredCount) creep.memory.tiredCount += 1;
        else creep.memory.tiredCount = 1;
        return 3;
    }
}