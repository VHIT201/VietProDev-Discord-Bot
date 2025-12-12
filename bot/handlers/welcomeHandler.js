import { PermissionsBitField } from 'discord.js';

export function registerWelcomeHandler(client, channelId, messageTemplate) {
  async function pickFallbackChannel(member) {
    try {
      const sys = member.guild.systemChannel;
      if (sys && sys.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)) return sys;
    } catch (e) {}

    try {
      const byName = member.guild.channels.cache.find(
        (c) => c.isTextBased && c.name && c.name.toLowerCase() === 'general' && c.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)
      );
      if (byName) return byName;
    } catch (e) {}

    try {
      const ch = member.guild.channels.cache.find(
        (c) => c.isTextBased && c.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)
      );
      if (ch) return ch;
    } catch (e) {}

    return null;
  }

  client.on('guildMemberAdd', async (member) => {
    try {
      const content = messageTemplate.replace('{user}', `<@${member.id}>`);

      let sendChannel = null;

      if (channelId) {
        try {
          const fetched = await member.client.channels.fetch(channelId);
          if (fetched && typeof fetched.send === 'function' && fetched.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)) {
            sendChannel = fetched;
          } else {
            console.warn('Configured WELCOME_CHANNEL_ID not usable, attempting fallback selection');
          }
        } catch (err) {
          console.warn('Could not fetch configured WELCOME_CHANNEL_ID, attempting fallback selection');
        }
      }

      if (!sendChannel) sendChannel = await pickFallbackChannel(member);

      if (!sendChannel) {
        try {
          await member.send(content);
          console.log(`Sent welcome DM to ${member.user.tag}`);
          return;
        } catch (dmErr) {
          console.warn('Unable to DM member and no channel available to send welcome message.');
          return;
        }
      }

      await sendChannel.send({ content });
      console.log(`Sent welcome message for ${member.user.tag} to channel ${sendChannel.id}`);
    } catch (err) {
      console.error('Error sending welcome message', err);
    }
  });
}
