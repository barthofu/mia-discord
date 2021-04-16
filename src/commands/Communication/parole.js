const CommandPattern = require("../../models/Command.js"),
      googleTTS = require('google-tts-api')
    
const names = {

    "208207211191730176": "ethan le furheur", //Ethan
    "290139158952017920": "juan vice cookie-dent", //Juan
    "296299023143403521": "quentin au gros boule", //Quentin
    "494193895668842497": "lucas vice-trézo", //Lucas
    "663444990487298048": "lénasexcrétaire", //Léna
    "692294443872550962": "claire comme de l'eau de roche", //Claire
    "260908777446965248": "baro le ragdoll", //Bartho
    "613394859906170938": "superémyseur", //Rémy K.
    "300581520224026625": "bebou master race", //Benjamin
    "289056901629607937": "wario lover", //Jules
    "186054282888478720": "antoine lpb", //Antoine
    "329170831248719872": "rémy david", //Rémy D.
    "402851453107961869": "momow yaoyorozu", //Momow
    "358520708932042754": "sanjosse la jambre droite", //Josse
    "689840615881441294": "molécule d'eau", //Auriane
    "425708710317522957": "joséphine", //Joséphine
    "169866171137523712": "zero two", //Jolan
    "142334776362270720": "le zède", //Lazare
    "751106751654264842": "seb le plus bo", //Seb
    "335175864062967809": "philippe à la kouizine", //Philippe
    "299173422762819594": "joshua", //Joshua
    "399297549166706699": "lucas bonnieul", //Lucas B.
    "287864448390135818": "swann", //Swann
    "484006855438499850": "thomas", //Thomas
    "250970680516935680": "mehdi", //Mehdi
    "499707439369945089": "maria", //Maria

}

const commandParams = {
    
    name: "parole",
    aliases: [],
    desc: "Demande la parole lors des réunions (à faire dans le channel <#801831203191390249>).",
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

    async run (msg, args, cmd) {

        if (/*!names[msg.author.id] || */ //no corresponding name found
            msg.channel.id !== config.channels.reuParole || //command made in the wrong channel
            !connection //reu not in progress (no connection avalaible)
            ) return msg.react("❌")

        msg.react("✅")

        //get url via the "api"
        let url = googleTTS.getAudioUrl(`${msg.member.nickname.split("|").join(",") /*names[msg.author.id]*/} lève la main`, {
            lang: 'fr-FR',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });

        //play audio from the url
        connection.play(url)
        
    }

    sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}