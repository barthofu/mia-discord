const CommandPattern = require("../../models/Command.js");
const cleverbot      = require("cleverbot-free");

const commandParams = {
    
    name: "talking",
    aliases: [],
    desc: {
        "en": "",
        "fr": ""
    },
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

} 

let webhooks = []

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        if (args[0] === 'start') {

            if (talking) return msg.reply('talking déjà en cours')

            talking = true

            let nextMessage = args.slice(1).join(" ") || "salut comment ça va ?"

	    webhooks = []

            let i = 0

            for (let i = 0; i < 2; i++) {

                webhooks.push(await msg.channel.createWebhook(db.talking.get(`[${i}].name`).value(), {
                    avatar: db.talking.get(`[${i}].avatar`).value()
                }))
            }

            while (talking) {

                for (let i = 0; i < 2; i++) {

                    let response = await cleverbot(nextMessage, db.talking.get(`[${i}].histo`).value())

                    nextMessage = response
                    db.talking.get(`[${i}].histo`).push(response).write()

                    await webhooks[i].send(response).catch(console.error)

                    await this.sleep(4)

                }

            }

        }

        else if (args[0] === 'stop') {

            talking = false

            for (let webhook of webhooks) await webhook.delete().catch(console.error)

            msg.react("✔")

        }





    }

    sleep (s) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
      }

}
