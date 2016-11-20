/* The tower attacks enemies */
module.exports = {run};

function run(tower) {
    let confGame = require("conf.game");

    let whitelist = confGame.whitelist;
    if (!whitelist) {
        whitelist = [];
    }

    // Find hostiles closest to the tower
    let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (creep) => {
            return (whitelist.indexOf(creep.owner.username) == -1);
        }
    });

    if (hostile) {
        tower.attack(hostile);
    }
}