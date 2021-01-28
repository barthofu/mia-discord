const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "next-reu",
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

    async run (msg, args, cmd, color) {

        if (args[0] == "off") {

            db.data.set("next-reu", null).write()
            return msg.react("✅")
        }

        if (args.length != 2) return msg.reply("commande invalide.\nex: `!next-reu 16/03 18h00`")

        let day = args[0].split("/")[0],
            month = args[0].split("/")[1],

            hour = args[1].split("h")[0],
            minute = args[1].split("h")[1]

            console.log(day, month, hour, minute)
        if (
            (day < 1 || day > 31) ||
            (month < 1 || month > 12) ||
            (hour < 0 || hour > 24) ||
            (minute < 0 || minute > 60)
        ) {
            return msg.reply("la date/heure renseignée n'est pas correcte.")
        }

        let time = new Date(2021, month - 1, day, hour - - 1, minute).getTime()

        db.data.set("next-reu", time).write()

        msg.react("✅")



    }


}