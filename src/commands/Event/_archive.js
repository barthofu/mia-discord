module.exports = class {

    async run (msg, args, cmd) {

        if (args.length === 0) return msg.reply("tu n'as pas précisé d'ID de catégorie.")
        
        let category = bot.channels.cache.get(args[0])

        if (!category) return msg.reply("cette catégorie n'existe pas.")

        //change the name of the category
        category.setName(category.name.split(" ").slice(1).join(" ") + " | " + dateFormat(new Date(), "dd-mm-yyyy"))

        //change category position
        category.setPosition(-1)

        msg.react("✅")
        
    }

}