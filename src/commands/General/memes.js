const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "memes",
    aliases: [],
    desc: "Donne l'accès au salon <#821522619718697010>.",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

const roleId = '831289157358714920'

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        if (msg.member.roles.cache.get(roleId)) {
            msg.member.roles.remove(roleId)
            msg.reply("tu n'as désormais plus accès au channel memes.")
        } else {
            msg.member.roles.add(roleId)
            msg.reply("tu as désormais accès au channel memes.")
        }

    }


}