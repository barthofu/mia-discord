const archiveId = "808392250610286603"

module.exports = class {

    async run (msg, args, cmd) {

        if (args.length === 0) return msg.reply("tu n'as pas précisé d'ID de catégorie.")
        
        let category = bot.channels.cache.get(args[0])

        if (!category) return msg.reply("cette catégorie n'existe pas.")

        //change category position
        await category.edit({position: bot.channels.cache.get(archiveId).position})

        //change the name of the category
        await category.setName(category.name.split(" ").slice(1).join(" ") + " | " + dateFormat(new Date(), "dd-mm-yyyy"))

        msg.react("✅")
        
    }

}
