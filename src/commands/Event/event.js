const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "event",
    aliases: [],
    desc: "Permets la gestion des events",
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

        let subsCommands = fs.readdirSync("./src/commands/Event").filter(file => file.startsWith("_")).map(fileName => fileName.split(".")[0].split("_")[1])

        if (args.length === 0 || !subsCommands.includes(args[0].toLowerCase())) return msg.reply("argument invalide. Liste des sous commandes possibles :\n" + subsCommands.join("\r\n"))

        const command = new (require(`./_${args[0].toLowerCase()}.js`))()

        await command.run(msg, args.slice(1), cmd)

    }


}
