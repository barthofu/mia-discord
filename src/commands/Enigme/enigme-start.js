const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "enigme-start",
    aliases: [],
    desc: "",
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

        let userObject = {
            id: msg.author.id,
            group: null,
            progress: []
        }

        const correspondances = {
            "1": "a",
            "2": "b",
            "3": "commun"
        }

        if (msg.channel.type !== "dm") return msg.reply("veuillez effectuer cette commande en message privé.")

        let ancientUser = db.enigme.get("users").find(e => e.id === msg.author.id).value()

        if (ancientUser) msg.channel.send(`**/!\ TU AS DEJA UNE PROGRESSION EN COURS. SI TU CHOISIS UN AUTRE GROUPE ELLE SERA REINITIALISEE /!\\**`)

        msg.channel.send(`**Le Requiem de 0 : Bienvenue à toi enquêteur !**
        Nous, MIA, comptons t'accompagner dans ta quête.
        Pour cela nous te conseillons vivement d’en premier lieu lire le règlement sur le serveur **Évent MIA**.
        
        > Pour cela, il faut choisir l'un de nos 3 chemins.
        
        1 | Groupe A (amménagé pour le groupe A)
        2 | Groupe B (amménagé pour le groupe B)
        3 | Commun (amménagé pour tout le monde)
        
        *Indique dans le tchat le numéro du groupe auquel tu veux appartenir.*
        *Toute l'énigme fonctionne par le BOT, il suffit d'écrire tes réponses, il les validera ou non*`)

        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content < 4 && me.content > 0, { max: 1, time: 60000 })
        if (!rep.first()) return msg.reply("opération annulée.")

        userObject.group = correspondances[rep.first().content]

        db.enigme.get("users").push(userObject).write()

        //première épreuve
        msg.channel.send(db.enigme.get("data").value().filter(e => e.groups.includes(userObject.group))[0].question)

    }


}