const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and clears the queue'),

    async execute(interaction) {
        const voiceConnection = getVoiceConnection(interaction.guildId);

        if (!voiceConnection) {
            return interaction.reply('I am not currently playing music in any voice channel.');
        }

        // Stop the audio player and remove event listeners
        const audioPlayer = voiceConnection.state.subscription.player;
        audioPlayer.stop();

        // Remove event listeners to prevent duplicate messages when starting new songs
        audioPlayer.removeAllListeners(AudioPlayerStatus.Playing);

        // Clear the guild's song queue
        if (global.queue.has(interaction.guildId)) {
            global.queue.set(interaction.guildId, []);
        }

        await interaction.reply('Music stopped and queue cleared.');
    },
};
