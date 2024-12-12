const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

async function playSong(interaction, voiceChannel, guildQueue) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const stream = ytdl(guildQueue[0], { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    // Remove existing listeners before attaching new ones
    player.removeAllListeners();

    player.on(AudioPlayerStatus.Playing, () => {
        interaction.followUp(`Now playing: ${guildQueue[0]}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
        guildQueue.shift();
        if (guildQueue.length > 0) {
            playSong(interaction, voiceChannel, guildQueue);
        } else {
            player.stop();
        }
    });

    player.on('error', error => {
        console.error(`Error: ${error.message}`);
        connection.destroy();
        interaction.followUp('An error occurred while playing the song.');
    });
}

module.exports = { playSong };
