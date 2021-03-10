const channelsTemplates = require("../../db/channelTemplates.json")

module.exports = class {

    async run (msg, args, cmd) {

        if (args.length === 0) return msg.reply("aucun nom de template renseigné")

        let template = channelsTemplates.culture.find(e => e.name === args[0]) || channelsTemplates.event.find(e => e.name === args[0])
        
        if (!template) return msg.reply(`template non trouvée.\nListe des templates disponibles :\n${
            channelsTemplates.event.map(e => `[\`event\`] ${e.name}`).concat(channelsTemplates.culture.map(e => `[\`culture\`] ${e.name}`)).join("\r\n")
        }`)

        let type = channelsTemplates.culture.find(e => e.name === args[0]) ? "culture" : "event"

        msg.channel.send(`
        \`\`\`md
        『${template.emote}』${template.fancyName}
        ${
            template.channels.map(channel => `${channel.type === "text" ? "#" : "<"}    |- ${channel.name}`)
        }
        \`\`\`
        `)
        
    }

}
