const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { playSong } = require('../utils/musicFunctions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips to the next song in the queue'),

    async execute(interaction) {
        const guildQueue = global.queue.get(interaction.guildId);

        if (!guildQueue || guildQueue.length === 0) {
            return interaction.reply('Skip what song genius :skull:');
        }

        // Remove the current song from the queue
        guildQueue.shift();

        if (guildQueue.length > 0) {
            playSong(interaction, interaction.member.voice.channel, guildQueue);
            interaction.reply('Skipped.');
        } else {
            // Stop playing as there are no more songs in the queue
            const voiceConnection = getVoiceConnection(interaction.guildId);
            if (voiceConnection) {
                const audioPlayer = voiceConnection.state.subscription.player;
                audioPlayer.stop();
            }
            global.queue.set(interaction.guildId, []); // Clear the queue
            interaction.reply('Thats the end of the queue.');
        }
    },
};
