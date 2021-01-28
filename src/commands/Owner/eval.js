const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "eval",
    aliases: [],
    desc: {
        "en": "Eval command.",
        "fr": "Commande eval"
    },
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

} 

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text
        }
        try {
            const code = msg.content.startsWith("```")?msg.content.replace("```"+config.evalName, "").replace("```", ""):args.join(" ")
            let evaled = eval(code);
            if (typeof evaled !== "string")
            require("util").inspect(evaled);
        } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

    }

}