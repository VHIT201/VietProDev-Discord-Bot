const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../configs/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra độ trễ của bot'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: '🏓 Đang ping...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📡 Độ trễ Bot', value: `${latency}ms`, inline: true },
                { name: '💓 Độ trễ API', value: `${apiLatency}ms`, inline: true }
            )
            .setTimestamp();
        
        await interaction.editReply({ content: null, embeds: [embed] });
    }
};
