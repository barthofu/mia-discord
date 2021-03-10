const CommandPattern = require("../../models/Command.js");
const cleverbot      = require("cleverbot-free");

const commandParams = {
    
    name: "start",
    aliases: [],
    desc: {
        "en": "",
        "fr": ""
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

        if (args[0] === 'start') {

            if (talking) return msg.reply('talking déjà en cours')

            talking = true

            let nextMessage = args.slice(1).join(" ") || "salut !"

            while (talking) {

                for (let i = 0; i < 2; i++) {

                    let response = await cleverbot(nextMessage, db.talking.get(`[${i}].histo`).value())

                    nextMessage = response
                    db.talking.get(`[${i}].histo`).push(response).write()

                    let webhook = await msg.channel.createWebhook(db.talking.get(`[${i}].name`).value(), {
                        avatar: db.talking.get(`[${i}].avatar`).value()
                    })
            
                    await webhook.send(response)

                    await this.sleep(5)

                }

            }

        }

        else if (args[0] === 'stop') {

            talking = false

            msg.react("✔")

        }





    }

    sleep (s) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
      }

}