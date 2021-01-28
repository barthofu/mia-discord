const CommandPattern = require("../../models/Command.js"),
      fs = require("fs"),
      { MessageEmbed } = require("discord.js");

const commandParams = {
    
    name: "help",
    aliases: [
        "h"
    ],
    desc: "Affiche l'aide du bot.",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        let prefix = db.guild.get(`guilds.${msg.guild.id}.prefix`).value(),
            page = 1,
            filter = (reaction, user) => user.id === msg.author.id && ["◀", "▶"].includes(reaction.emoji.name);

        let m = await msg.channel.send(this.getEmbed(msg, color, prefix, page));
        await m.react("◀"); await m.react("▶");

        let reac = await m.createReactionCollector(filter, {time: 1000*60*5});

        reac.on("collect", async(reaction) => {

            reaction.users.remove(msg.author.id);

            if (reaction.emoji.name === "◀") page = page === 1 ? fields.length : page - 1;
            else page = page === fields.length ? 1 : page + 1;

            await m.edit(this.getEmbed(msg, color, prefix, page));
        })

    }

    getEmbed (msg, color, prefix, page) {


        let embed = new MessageEmbed()
        .setTitle(lang["help"]["title"][la])
        .setColor(color)
        .setAuthor(msg.author.username, msg.author.displayAvatarURL())
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png")
        
        let categories = fs.readdirSync(`./src/commands`)
        categories.forEach(category => {
            embed.addField(`${category}`, fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith(".js") && !file.startsWith("_")).map(
                    commandName => {
                        let command = bot.commands.get(commandName.split(".")[0])
                        console.log(commandName, command)
                        return command.verification.enabled == true && command.permission.owner == false?`\`${db.server.get(`guilds.${msg.guild.id}.prefix`).value()}${commandName.split(".")[0]}\`${command.info.aliases.length > 0?` (${command.info.aliases.map(val => `\`${val}\``).join(" | ")})`:""} | ${command["info"]["desc"][la]} ${this.checkCommand(command)}`:""
                    } 
                ).join("\r\n")
            )
        })

        msg.channel.send(embed)

    }

    checkCommand (command) {
        let text = ""
        if (command.verification.nsfw == true) text+="[**NSFW**] "
        if (command.permission.memberPermission.includes("ADMINISTRATOR")) text+="[**ADMIN**] "
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}