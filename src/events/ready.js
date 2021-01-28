const prettyMilliseconds = require('pretty-ms');

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
            
        }, 15 * 1000) //each 15 sec


        setInterval(async () => {
            
            //update next-reu
            let reuTime = db.data.get("next-reu").value(),
                text
            if (reuTime) {

                let timeLeft = reuTime - new Date().getTime()

                if (timeLeft <= 0) {

                    //reu in progress
                    if (timeLeft > 2 *60*60*1000) text = "🛑 Réunion en cours"

                    //reu terminated
                    else {
                        
                        db.data.set("next-reu", null).write()
                        text = "-"
                    }
                } 

                //reu planned
                else text = "⏱️ Réunion : " + prettyMilliseconds(timeLeft).split(" ").slice(0, -1).join(" ")

            } else {

                //no reu planned
                text = "-"
            }
            
            bot.channels.cache.get(config.channels.nextReu).setName(text)
        
        }, 5 * 60 * 1000);
        
    }
    
    
    
}