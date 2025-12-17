const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../configs/config');
const Logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            // Lấy channel từ config hoặc tìm channel thay thế
            let welcomeChannel = null;
            
            if (config.channels.welcome) {
                welcomeChannel = member.guild.channels.cache.get(config.channels.welcome);
            }
            
            // Fallback: tìm system channel hoặc channel "general"
            if (!welcomeChannel) {
                welcomeChannel = member.guild.systemChannel ||
                    member.guild.channels.cache.find(ch => 
                        ch.name.toLowerCase().includes('general') && ch.isTextBased()
                    );
            }
            
            if (!welcomeChannel) {
                Logger.warn(`Không tìm thấy welcome channel cho server ${member.guild.name}`);
                return;
            }
            
            // Tạo Embed Welcome
            const welcomeEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎉 Chào mừng thành viên mới!')
                .setDescription(config.messages.welcome.replace('{user}', `<@${member.id}>`))
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: '👤 Tên', value: member.user.tag, inline: true },
                    { name: '📅 Tham gia lúc', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
                    { name: '📊 Thành viên thứ', value: `#${member.guild.memberCount}`, inline: true }
                )
                .setFooter({ text: 'VietProDev - Chúc bạn có trải nghiệm tuyệt vời!' })
                .setTimestamp();
            
            // Kiểm tra xem có ảnh welcome không
            const imagePath = path.join(__dirname, '../../../assets/images/welcome-card.png');
            const messageOptions = { embeds: [welcomeEmbed] };
            
            if (fs.existsSync(imagePath)) {
                const attachment = new AttachmentBuilder(imagePath, { name: 'welcome.png' });
                welcomeEmbed.setImage('attachment://welcome.png');
                messageOptions.files = [attachment];
            }
            
            await welcomeChannel.send(messageOptions);
            Logger.success(`Đã gửi welcome message cho ${member.user.tag} tại ${member.guild.name}`);
            
        } catch (error) {
            Logger.error('Lỗi gửi welcome message', error);
        }
    }
};
