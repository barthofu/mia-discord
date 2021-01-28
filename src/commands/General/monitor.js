const CommandPattern = require("../../models/Command.js");
const si = require("systeminformation");

const commandParams = {
    
    name: "monitor",
    aliases: [],
    desc: "Utilisation de la RAM en temps réel.",
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 5000

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        const mem = await si.mem();
        const used = process.memoryUsage().heapUsed;


        msg.channel.send(new MessageEmbed()
            .setTitle("📊 Utilisation actuelle des ressources :")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .addField("⫸ RAM", `[${Math.round(used/1024/1024)}/${Math.round(mem.total/1024/1024)}](https://google.com) Mo (**${(used/mem.total*100).toFixed(2)}**%)`)
        );

    }


}