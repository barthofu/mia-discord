module.exports = class {

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