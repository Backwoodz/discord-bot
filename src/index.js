const {token, clientId, OPENAI_API_KEY} = require('../config.json');
const {Client, ActivityType, GatewayIntentBits, REST, Routes} = require('discord.js');
const {Configuration, OpenAIApi} = require("openai");

const commands = [
    {
        name: 'ping',
        description: 'Let\'s find out what will happen :)!',
    },
    {
        name: 'ai',
        description: 'Short overview of the DALL-E functions'
    }
];

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const rest = new REST({version: '10'}).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), {body: commands});

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', async () => {
    console.log(`Ready | Logged in as ${client.user.tag} | I'm on ${client.guilds.cache.size} guild(s)`);
    client.user.setPresence({
        activities: [{name: `Netflix`, type: ActivityType.Watching}],
        status: 'online'
    });
});

client.on('messageCreate', async (message) => {
    try {
        const prefix = '!ai'
        const maxNumberOfPictures = 10;

        if (!message.content.startsWith(prefix) || message.author.bot) return false;

        const rawInput = message.content;
        let numberOfPicturesToGenerate = rawInput.substring(prefix.length);
        numberOfPicturesToGenerate = numberOfPicturesToGenerate.substring(0, numberOfPicturesToGenerate.indexOf(' '));

        if (numberOfPicturesToGenerate.length === 0) {
            numberOfPicturesToGenerate = 1;
        } else {
            if (numberOfPicturesToGenerate > maxNumberOfPictures ) {
                await message.reply('Maximale Anzahl (10) überschritten!');
                return false;
            }
        }

        let userInput = rawInput.toLowerCase().replace(prefix, '');
        userInput = userInput.trim();


        const containsBannedWords = await openai.createModeration({
            input: userInput
        });

        if (containsBannedWords.data.results[0].flagged) {
            await message.reply('Eingabe verstößt gegen die Inhaltsrichtlinie von OpenAI!');
            return false;
        }

        await message.reply('Eingabe wird überprüft...');

        const response = await openai.createImage({
            prompt: userInput,
            n: parseInt(numberOfPicturesToGenerate),
            size: '1024x1024'
        });

        for (let i = 0; i < numberOfPicturesToGenerate; i++) {
            const image_url = response.data.data[i].url;
            await message.reply(image_url);
        }
    } catch (error) {
        await message.reply('Eingabe verstößt gegen die Inhaltsrichtlinie von OpenAI!');
        console.log(error);
        return false;
    }

});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Ciao Degga!');
    }

    if (interaction.commandName === 'ai') {
        await interaction.reply('DALL-E 2 Bot\n\nBefehl: !ai\nAnzahl: 1-10\nBeispiele:\n!ai5 a red car -> 5 Bilder\n!ai a blue car -> 1 Bild');
    }
});

client.login(token);