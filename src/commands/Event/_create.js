const channelsTemplates = require("../../db/channelTemplates.json")

const sepCatIds = {
    "culture": "807778805129281626",
    "event": "807778744264687676"
}

module.exports = class {

    async run (msg, args, cmd) {

        if (args.length === 0) return msg.reply("aucun nom de template renseigné")

        let template = channelsTemplates.culture.find(e => e.name === args[0]) || channelsTemplates.event.find(e => e.name === args[0])
        
        if (!template) return msg.reply(`template non trouvée.\nListe des templates disponibles :\n${
            channelsTemplates.event.map(e => `[\`event\`] ${e.name}`).concat(channelsTemplates.culture.map(e => `[\`culture\`] ${e.name}`)).join("\r\n")
        }`)

        let type = channelsTemplates.culture.find(e => e.name === args[0]) ? "culture" : "event"
    
        //category creation
        let category = await msg.guild.channels.create(`『${template.emote}』${template.fancyName}`, {
            type: "category",
            permissionOverwrites: [
                {
                    id: msg.guild.id,
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: template.role,
                    allow: ["VIEW_CHANNEL"]
                }
            ]
        })
        await category.setPosition(this.getPosition(type))

        let channels = template.channels.concat(channelsTemplates.default)

        //channels creation
        for (let i in channels) {

            let channel = channels[i]

            let permissionsOverwrites = [
                {
                    id: msg.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: template.role,
                    allow: channel.permissionAuth,
                    deny: channel.permissionForbid
                }
            ]

            if (channel.additionnalPermissions) {
                channel.additionnalPermissions.map(e => permissionsOverwrites.push({
                    id: e.role,
                    allow: e.permissionAuth,
                    deny: e.permissionForbid
                }))
            }

            let discordChannel = await msg.guild.channels.create(channel.name, {
                "type": channel.type,
                "permissionOverwrites": permissionsOverwrites
            })

            await discordChannel.setParent(category.id)
        }

        msg.react("✅")

    }

    getPosition (type) {

        return type === "culture" ? bot.channels.cache.get(sepCatIds[type]) : -1

    }


}