/* This module contains functions to help creeps create paths and follow them */
module.exports = {
    createPath, move
};

function createPath(creep, x, y) {
    /* Creates a path from creep to target that the creep can follow by using move() */
    creep.memory.path = creep.pos.findPathTo(x, y);
    creep.memory.pathprog = 0;
    creep.memory.target = {x: x, y: y};
}

function move(creep) {
    /* Move the creep along the created path. Will regenerate path if hindered.
    *  Return codes:
    *  0 - OK.
    *  1 - path completed.
    *  2 - had to create new path.
    *  3 - is tired.
    *  4 - creep memory does not contain path.*/
    let path = creep.memory.path;
    let pathprog = creep.memory.pathprog;

    if (!creep.memory.path) return 4;
    if (path.length == pathprog) return 1;

    let res = creep.move(path[pathprog].direction);
    if (res == OK) {
        if (creep.pos.x == path[pathprog].x && creep.pos.y == path[pathprog].y) {
            creep.memory.pathprog = pathprog + 1;
            return 0;
        }
        // Something went wrong, most likely something in the way
        // Solution: Generate new path
        let target = creep.memory.target;
        creep.memory.path = creep.pos.findPathTo(target.x, target.y);
        creep.memory.pathprog = 0;
        return 2;
    } else if (res == ERR_TIRED) {
        creep.memory.tiredCount += 1;
        return 3;
    }
}