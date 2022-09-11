require("dotenv").config();
const {Client, ActivityType } = require("discord.js");

const client = new Client({intents: []});

client.on("ready", () => {
    console.log(`Ready | Logged in as ${client.user.tag} | I'm on ${client.guilds.cache.size} guild(s) |`);
    client.user.setPresence({
        activities: [{ name: `NETFLIX`, type: ActivityType.Watching }],
        status: 'online'
    });
});


client.login(process.env.DISCORD_BOT_TOKEN);