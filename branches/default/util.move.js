/* This module contains functions to help creeps create paths and follow them */
module.exports = {
    createPath, move
};

function createPath(creep, x, y) {
    /* Creates a path from creep to target that the creep can follow by using move() */
    creep.memory.path = creep.pos.findPathTo(x, y);
    creep.memory.pathprog = 0;
    creep.memory.pathtarget = {x: x, y: y};
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

    if (!creep.memory.path) return 4;
    if (creep.memory.path.length == 0) return 4;

    // Check if last move went fine
    if (pathprog) {
        if (!(creep.pos.x == path[pathprog-1].x && creep.pos.y == path[pathprog-1].y)) {
            // Last move didn't go fine
            // Solution: Generate new path
            let target = creep.memory.pathtarget;
            creep.memory.path = creep.pos.findPathTo(target.x, target.y);
            creep.memory.pathprog = 1;
            creep.move(path[0].direction);

            return 2;
        }
    }

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