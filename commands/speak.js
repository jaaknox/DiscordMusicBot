const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Jacobbot has something to say...'),

    async execute(interaction) {
        await interaction.reply('I am Jacob');
    },
};
