const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, ChannelType } = require('discord.js');

// The "kill" function targets a member that is currently in a voice call. It has a 5/6 chance of sending them
// a 1 second warning before kicking them from the server (and immediately reinviting them). It has a 1/6 chance
// of backfiring on the person who initiated the "kill" command, doing the above actions to them.
//
// If a targeted player leaves the voice call within the 1 second time frame between the warning and the kick action,
// this will "parry" the command back at the initiator, immediately kicking them.
//
// You cannot "parry" a backfired kill command, and you cannot "parry" another parry.
//
// As long as a killed member rejoins the server within 30 seconds, all their roles will be returned. After that, Jacobbot forgets.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Walking the bloodstained path carries a risk... (1/6 chance of backfiring)')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('Who should be killed?')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        
        if (!interaction.guild) {
            return await interaction.followUp("This command can only be used within a server.");
        }

        const guild = interaction.guild;
        const targetUser = interaction.options.getUser('target');
        const initiatingMember = interaction.member;
        const targetMember = await guild.members.fetch(targetUser.id).catch(console.error);

        try {
            const textChannel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText);
            const invite = textChannel ? await textChannel.createInvite({ maxAge: 0, maxUses: 1 }) : null;

            let targetToKick = targetMember;
            let escaped = false;
            let backfire = Math.random() < 1 / 6;

            if (targetMember.voice.channel) {
                const escapeTime = 3000; // 1 second
                escaped = await new Promise(resolve => {
                    const timeout = setTimeout(() => resolve(false), escapeTime);
                    guild.client.once('voiceStateUpdate', (oldState, newState) => {
                        clearTimeout(timeout);
                        resolve(newState.member.id === targetMember.id && !newState.channel);
                    });
                });

                if (escaped) {
                    targetToKick = initiatingMember;
                    backfire = false; // If they escaped, don't backfire
                }
            }

            if (!escaped && backfire) {
                targetToKick = initiatingMember;
            }

            const roles = targetToKick.roles.cache.map(r => r.id).filter(id => id !== guild.id);
            const message = 'DEATH IMMINENT!!!' + (invite ? `https://discord.gg/${invite.code}` : ''); // Warning and reinvite
            await targetToKick.send('https://giphy.com/gifs/UTkzpFmbkHYzuOLkp4');
            await targetToKick.send(message);

            await guild.members.kick(targetToKick, { reason: 'KILL!!!' });

            setTimeout(async () => {
                try {
                    const newMember = await guild.members.fetch(targetToKick.id);
                    await newMember.roles.add(roles);
                } catch (e) {
                    console.error('Error adding roles back:', e);
                }
            }, 30000); // 30 seconds wait for rejoin

            const action = escaped ? 'got parried' : (backfire ? 'got backfired' : 'has been killed');
            await interaction.editReply(`${targetToKick.user.username} ${action}.`);
        } catch (error) {
            console.error('Error executing the kill command:', error);
            await interaction.followUp('Failed to kill target. Possible permissions issue?');
        }
    },
};
