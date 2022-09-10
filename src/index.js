require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client({intents: []});

client.on("ready", () => {
    console.log(`Ready | Logged in as ${client.user.tag} | I'm on ${client.guilds.cache.size} guild(s) |`);
    client.user.setPresence({
        activities: [{name: 'test123'}],
        status: 'online',
    });
    client.user.setActivity('am Code rum', {type: Discord.Playing});
});


client.login(process.env.DISCORD_BOT_TOKEN);