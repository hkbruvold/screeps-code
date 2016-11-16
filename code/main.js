var roleSafeHarvester = require ('role.safeharvester');
var roleSafeUpgrader = require ('role.safeupgrader');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadworker = require('role.roadworker');
var roleClaimer = require('role.claimer');
var roleEnergyStealer = require('role.energystealer');
var roleRoomer = require('role.roomer');
var roleDedicatedHarvester = require('role.dedicatedharvester');
var roleSpawnFiller = require('role.spawnfiller');
var roleTower = require('role.tower');
var managerSpawning = require('manager.spawning');

module.exports.loop = function () {
    if (Game.creeps["SAFEMODE_HARVESTER"]) {roleSafeHarvester.run(Game.creeps["SAFEMODE_HARVESTER"]);}
    if (Game.creeps["SAFEMODE_UPGRADER"]) {roleSafeUpgrader.run(Game.creeps["SAFEMODE_UPGRADER"]);}
    if (managerSpawning.safe(Game.spawns["Spawn1"]) == false) {
        managerSpawning.run(Game.spawns["Spawn1"]);
    }
    
    
    //roleTower.run(Game.getObjectById("582a0533739724f97f69cb8c"));
    
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'spawnfiller') {
            roleSpawnFiller.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'roadworker') {
            roleRoadworker.run(creep);
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        } else if (creep.memory.role == 'energystealer') {
            roleEnergyStealer.run(creep);
        } else if (creep.memory.role == 'roomer') {
            roleRoomer.run(creep);
        } else if (creep.memory.role == 'dedicatedharvester') {
            roleDedicatedHarvester.run(creep);
        }
    }
}
