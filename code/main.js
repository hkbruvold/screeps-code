var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRoadworker = require('role.roadworker');
var roleClaimer = require('role.claimer');
var roleEnergyStealer = require('role.energystealer');
var roleRoomer = require('role.roomer');
var roleDedicatedHarvester = require('role.dedicatedharvester');
var roleSpawnFiller = require('role.spawnfiller');
var managerSpawning = require('manager.spawning');

module.exports.loop = function () {
    managerSpawning.run(Game.spawns["Spawn1"])
    
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
