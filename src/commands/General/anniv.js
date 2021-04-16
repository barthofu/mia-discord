const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "anniv",
    aliases: [],
    desc: "Liste les anniversaires de tous les membres de la liste.",
    enabled: true,
    dm: true,
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

    async run (msg, args, cmd) {

        let members = db.members.value()

        msg.channel.send(new MessageEmbed()
        
            .setColor(color)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
            .setTitle("Anniversaires des membres de la liste")
            .setDescription(

                members
                    .map(member => { return { name: member.name, formatedName: member.name.split(" ").slice(-1) + " " + member.name.split(" ").slice(0, -1).map(e => e[0]).join("."), birthday: Date.parse(member.birthday.split("/").reverse().join("-")) } })
                    .sort((a, b) => a.birthday - b.birthday)              
                    .map(member => `[${member.formatedName}](https://google.com) : **${members.find(e => e.name === member.name).birthday}**`)

            )
        
        )

    }

}