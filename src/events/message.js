const cmdCooldown = {}

module.exports = class {

    async run (msg) {

        let prefix = config.prefix,
            args = msg.content.slice(prefix.length).trim().split(/ +/g),
            cmd = args.shift().toLowerCase()

        //enigme
        if (msg.channel.type === "dm") {

            let user = db.enigme.get("users").find(e => e.id === msg.author.id).value()

            if (user) {
                //answer verification
                if (user.progress.length === db.enigme.get("data").value().length - 1) return

                let epreuve = db.enigme.get("data").value().filter(e => e.groups.includes(user.group))[user.progress.length]
                let nextEpreuve = db.enigme.get("data").value().filter(e => e.groups.includes(user.group))[user.progress.length + 1]

                if (epreuve.answer.find(e => e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === msg.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
                    //correct answer

                    msg.react("✅")
                    msg.channel.send(nextEpreuve.question)

                    db.enigme.get("users").find(e => e.id === msg.author.id).get("progress").push(epreuve.name + " : " + new Date()).write()

                } else msg.react("❌")
            }
        }

        //check if message starts with prefix
        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {

            if (msg.author.id == config.ownerID) {
                if (msg.content === ".r") client.reload(msg)
                else if (msg.content.startsWith("```"+config.evalName) && msg.content.endsWith("```")) await bot.commands.get("eval").run(msg, args, cmd)
            }
            return
        }

        //check if user is a bot
        if (msg.author.bot) return

        //check user
        //client.checkUser(msg.author.id)

        for (let value of bot.commands.array()) {

            if (value.info.name == cmd || value.info.aliases.map(val => val.replace("_", "")).includes(cmd)) {

                //check maintenance
                if (db.data.get('maintenance').value() && !config.dev.includes(msg.author.id)) {
                    return msg.reply(`le bot est en maintenance, merci de réessayer plus tard.\n*Début de la maintenance : **${dateFormat(db.data.get("maintenance").value(), "HH:MM")}***`) 
                } 
                //check user permission
                if (value.permission.owner == true && !config.dev.includes(msg.author.id)) return msg.reply("tu manques de permissions pour pouvoir utiliser cette commande !")
                let neededPermission = []
                value.permission.memberPermission.forEach(permission => {
                    if(!msg.channel.permissionsFor(msg.member).has(permission)) neededPermission.push(permission)
                })
                if (neededPermission.length > 0 && !config.dev.includes(msg.author.id)) return msg.reply("tu manques de permissions pour pouvoir utiliser cette commande !")
                //check bot permission
                neededPermission = []
                value.permission.botPermission.forEach(permission => {
                    if(!msg.channel.permissionsFor(msg.guild.me).has(perm)) neededPermission.push("**"+permission+"**")
                })
                if (neededPermission.length > 0) return msg.reply(`je n'ai pas ces permissions pour pouvoir éxecuter cette commande :\n${neededPermission.join(', ')}`)
                //check DM
                if (value.verification.dm === false && msg.channel.type === "dm") return msg.reply("Cette commande ne peut pas être utilisée ici.")
                //check NSFW
                if (value.verification.nsfw === true && !msg.channel.nsfw) return msg.reply("tu dois être dans un salon NSFW pour utiliser cette commande.")
                //check if enabled
                if (value.verification.enabled == false && !config.dev.includes(msg.author.id)) return msg.reply("cette commande est désactivée.")
                //check cooldown
                if (value.info.cooldown !== null) {
                    //there is a cooldown
                     if (!cmdCooldown[value.info.name]) cmdCooldown[value.info.name] = []
                     let match = cmdCooldown[value.info.name].find(val => val.id === msg.author.id)
                     if (match) {

                        if (new Date().getTime() >= match.time + value.info.cooldown) {
                            //remove cooldown
                            cmdCooldown[value.info.name].map(val => {
                                if (val.id === msg.author.id) return val.time = new Date().getTime();
                            })
                        }
                        //blocked
                        else return msg.reply("cette commande est en cooldown !\nTemps restant : **"+Math.ceil((match.time+value.info.cooldown - new Date().getTime())/1000)+"** sec")
                     } else cmdCooldown[value.info.name].push({ id: msg.author.id, time: new Date().getTime() })
                }

                //run
                await bot.commands.get(value.info.name).run(msg, args, cmd)

            }
        }

    }

}
