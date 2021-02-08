const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "suppr-event",
    aliases: [],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: ["ADMINISTRATOR"],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        if (args.length === 0) return msg.reply("tu n'as pas précisé d'ID de catégorie.")
        
        let category = bot.channels.cache.get(args[0])

        if (!category) return msg.reply("cette catégorie n'existe pas.")

        //delete channels inside the category
        category.children.map(e => bot.channels.cache.get(e.id).delete())

        //delete the category
        category.delete()

        msg.react("✅")

    }


}