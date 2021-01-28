global.
    //npm
    dateFormat   = require('dateformat'),
    _            = require('lodash'),
    //local databases
    db           = {},
    config       = require("../db/config.json"),
    //other
    client       = new (require("./Client.js"))(),
    bot          = client.bot,
    MessageEmbed = client.MessageEmbed,
    utils        = new (require("./Utils.js"))(),
    color        = config.colors.default

module.exports = async () => {

    await client.init();
};