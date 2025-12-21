import { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fs from 'fs';
import path from 'path';

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
      // Build the welcome content internally (do not use environment WELCOME_MESSAGE)
      const mention = `<@${member.id}>`;
      const contentText = `**VietProDev** — Giải pháp phần mềm & Đào tạo lập trình\n\n` +
        `Về chúng tôi: Đơn vị hàng đầu cung cấp giải pháp phần mềm hiện đại và chương trình đào tạo theo dự án thực tế, cam kết chất lượng và sáng tạo.\n\n` +
        `Tầm nhìn: Trở thành đối tác công nghệ chiến lược tin cậy tại Việt Nam.\n` +
        `Sứ mệnh: Đồng hành cùng doanh nghiệp chuyển đổi số và ươm mầm lập trình viên tài năng.\n\n` +
        `Cam kết: Triển khai minh bạch, hỗ trợ dài hạn và tuân thủ tiêu chuẩn chất lượng/bảo mật.\n\n` +
        `VUI LÒNG GỬI LỜI CHÀO ĐẾN MỌI NGƯỜI VÀ GIỚI THIỆU BẢN THÂN NHÉ !!!!`;

      const fullDescription = `Chào mừng ${mention}!\n\n` + contentText;

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

      // Try several image locations and attach the first existing one
      const candidates = [
        path.resolve(process.cwd(), 'assets', 'welcome-banner.png'),
        path.resolve(process.cwd(), 'src', 'assets', 'welcome-banner.png'),
        path.resolve(process.cwd(), 'src', 'assets', 'img', 'chaomungvietprodev.png'),
        path.resolve(process.cwd(), 'assets', 'getting-started-demo.gif'),
      ];
      let imgPath = null;
      for (const p of candidates) {
        if (fs.existsSync(p)) { imgPath = p; break; }
      }

      // Build a polished embed layout for welcome
      const shortIntro = `Chào mừng ${mention}!`;
      const authorIcon = client?.user?.displayAvatarURL?.() || null;
      const embed = new EmbedBuilder()
        .setAuthor({ name: 'VietProDev', iconURL: authorIcon })
        .setTitle('Chào mừng đến với VietProDev')
        // .setDescription(shortIntro + '\n\n' + contentText.split('\n').slice(0,2).join(' '))
        .addFields(
          { name: '🔭 Tầm nhìn', value: 'Trở thành đối tác công nghệ chiến lược tin cậy.', inline: true },
          { name: '🎯 Sứ mệnh', value: 'Đồng hành cùng doanh nghiệp chuyển đổi số.', inline: true },
          { name: '\u200B', value: '\u200B', inline: false },
          { name: '📞 Hỗ trợ', value: 'Liên hệ để được tư vấn và kết nối nghề nghiệp.' }
        )
        .setColor(0x0FB7A4)
        .setFooter({ text: 'VietProDev • Học tập - Kết nối - Phát triển' })
        .setTimestamp()
        .setThumbnail(member.user?.displayAvatarURL?.({ size: 128 }));

      if (imgPath) embed.setImage(`attachment://${path.basename(imgPath)}`);

      // Send DM if no channel, otherwise send to channel; include image as attachment when present
      if (!sendChannel) {
        try {
          let sent;
          if (imgPath) {
            sent = await member.send({ embeds: [embed], files: [{ attachment: imgPath, name: path.basename(imgPath) }], components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('intro_self_welcome').setLabel('Giới thiệu bản thân').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setLabel('Trang chủ').setStyle(ButtonStyle.Link).setURL('https://vietprodev.vn')
              )
            ]});
          } else {
            sent = await member.send({ embeds: [embed] });
          }
          // blink effect
          setTimeout(async () => {
            try {
              const blink = EmbedBuilder.from(embed).setColor(0xFFD166);
              await sent.edit({ embeds: [blink] });
            } catch(e){}
          }, 700);

          console.log(`Sent welcome DM to ${member.user.tag}`);
          return;
        } catch (dmErr) {
          console.warn('Unable to DM member and no channel available to send welcome message.');
          return;
        }
      }

      // send to channel with buttons and blink
      let sentMsg;
      if (imgPath) {
        sentMsg = await sendChannel.send({ embeds: [embed], files: [{ attachment: imgPath, name: path.basename(imgPath) }], components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('intro_self_welcome').setLabel('Giới thiệu bản thân').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setLabel('Trang chủ').setStyle(ButtonStyle.Link).setURL('https://vietprodev.vn')
          )
        ]});
      } else {
        sentMsg = await sendChannel.send({ embeds: [embed] });
      }
      setTimeout(async () => {
        try { const blink = EmbedBuilder.from(embed).setColor(0xFFD166); await sentMsg.edit({ embeds: [blink] }); } catch(e){}
      }, 700);
      console.log(`Sent welcome message for ${member.user.tag} to channel ${sendChannel.id}`);
    } catch (err) {
      console.error('Error sending welcome message', err);
    }
  });
}
