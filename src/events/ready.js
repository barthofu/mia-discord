const prettyMilliseconds = require('pretty-ms'),
      cron = require('node-cron'),
      members = require('../db/members.json');

var index = 0

module.exports = class {
    
    async run () {
        
        client.startingConsole();

        setInterval(async () => {
            
            //activity change
            let activity = config.activities[index]
            if (activity.type === "STREAMING") {
                //streaming activity
                bot.user.setStatus('available')
                bot.user.setActivity(activity.text, {
                    "url": "https://www.twitch.tv/discord",
                    "type": "STREAMING"
                })
            } else {
                //other activities
                bot.user.setActivity(
                    activity.text
                        .replace("POIDS", db.data.get("stats.poids").value())
                        .replace("FICHIERS", db.data.get("stats.fichiers").value())
                        .replace("VERSION", config.version),
                    { type: activity.type }
                ) //different activities : 'PLAYING', 'WATCHING', 'LISTENING'
            }
            index++
            if (index === config.activities.length) index = 0
            
            //stats update
            client.checkDaily()

            //check birthday
            if (dateFormat(new Date(), "HH:MM") === "23:50") {
                members.map(member => {
                    if (member.birthday.split("/").slice(0, -1).join("/") === dateFormat(new Date().getTime() + 24 * 60 * 60 * 1000, "dd/mm")) {
                        //send birthday notification to all the members
                        bot.guilds.cache.get("777312284409724958").roles.cache.get("777312284417982508").members.map(e => {
                            if (e.id !== member.id) bot.users.cache.get(e.id).send(`Dans 10 minutes c'est l'anniversaire de **${member.name}** ! N'oublie pas d'aller le lui souhaiter ;)`)
                        })
                    }
                })
            } 
            
        }, 60 * 1000) //each minutes

        //each 5 minutes within an hour
        cron.schedule('*/10 * * * *', async () => {

            //update next-reu
            let reuTime = db.data.get("next-reu").value(), text

            if (reuTime) {

                let timeLeft = reuTime - new Date().getTime()

                if (timeLeft <= 0) {

                    //reu in progress
                    if (timeLeft > - (2 * 60 * 60 * 1000)) {
                        
                        text = "🛑 Réunion en cours"

                        await this.joinReuVoiceChannel()

                    }

                    //reu terminated
                    else {
                        
                        db.data.set("next-reu", null).write()
                        text = "-"

                        this.leaveReuVoiceChannel()

                    }
                }

                else {

                    if (timeLeft > 5 * 60 * 1000 && timeLeft <= 15 * 60 * 1000) {

                        //bot.channels.cache.get(config.channels.rappelReu).send(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n||@everyone||\n\n__**La réunion est sur le point de débuter !**__\n\nPensez bien à vous renseigner sur l'ODJ dans <#777312284942008379> ;)\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)
                    }
    
                    //reu planned
                    else text = "⏱️ Réu : " + prettyMilliseconds(timeLeft + 1000).split(" ").slice(0, -1).join(" ")

                    this.leaveReuVoiceChannel()

                }

            } else {

                //no reu planned
                text = "-"

                this.leaveReuVoiceChannel()

            }

            bot.channels.cache.get(config.channels.nextReu).setName(text)

        })
        
    }


    async joinReuVoiceChannel () {

        let voiceChannel = bot.channels.cache.get(config.channels.reuVoice)
        connection = await voiceChannel.join()
    }

    
    leaveReuVoiceChannel () {

        if (connection) {

            connection = null
            bot.channels.cache.get(config.channels.reuVoice).leave()
        }
    }
    
    
    
}
