const {token, clientId} = require('../config.json');
const {Client, ActivityType, GatewayIntentBits, REST, Routes} = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Let\'s find out what will happen :)!',
    },
];

const client = new Client({intents: [GatewayIntentBits.Guilds]});

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Ready | Logged in as ${client.user.tag} | I'm on ${client.guilds.cache.size} guild(s)`);
    client.user.setPresence({
        activities: [{name: `Netflix`, type: ActivityType.Watching}],
        status: 'online'
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Ciao Degga!');
    }
});

client.login(token);