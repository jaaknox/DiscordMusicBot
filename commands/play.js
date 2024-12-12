const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { playSong } = require('../utils/musicFunctions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Let jacobbot serenade you with sweet tunes')
        .addStringOption(option => 
            option.setName('url')
            .setDescription('The YouTube video URL')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const url = interaction.options.getString('url');
        if (!ytdl.validateURL(url)) {
            return interaction.editReply('Erm yeah buddy... looks like that’s not a valid URL... back to the drawing board pal.');
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.editReply('Uhh WHERE do you expect me to play this? You’re not in a voice call.');
        }

        const guildQueue = global.queue.get(interaction.guildId) || [];
        guildQueue.push(url);
        global.queue.set(interaction.guildId, guildQueue);

        let videoTitle = 'some video';
        try {
            const videoInfo = await ytdl.getInfo(url);
            videoTitle = videoInfo.videoDetails.title;
        } catch (error) {
            console.error('Error retrieving video info:', error);
        }

        if (guildQueue.length === 1) {
            try {
                playSong(interaction, voiceChannel, guildQueue);
            } catch (error) {
                console.error(error);
                interaction.editReply('AHHHHH!! ERROR!!! THERE WAS AN ERROR PANIC!!! OH GOD!');
            }
        } else {
            interaction.editReply(`Song added to queue: ${videoTitle}`);
        }
    },
};
