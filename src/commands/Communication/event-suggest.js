const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "event-suggest",
    aliases: [],
    desc: "Fais une suggestion dans <#777452959947816981>.",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        if (args.length == 0) return msg.reply("tu n'as pas précisé de suggestion !")

        let webhook = await bot.channels.cache.get(config.channels.eventIdeas).createWebhook(msg.author.username, {
            avatar: msg.author.displayAvatarURL()
        })

        let m = await webhook.send(new MessageEmbed()
            .setColor(color)
            .setDescription(args.join(' '))
        )

        await m.react("✅") ; await m.react("804087670979559484") ; await m.react("❌")

        await webhook.delete()

        await msg.react("✅")

    }


}