const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../configs/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Xem thông tin thời tiết')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('Tên thành phố')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        const city = interaction.options.getString('city') || 'Biên Hòa';
        const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
        
        try {
            const res = await fetch(url, { 
                headers: { 'User-Agent': 'VietProDev-Bot' } 
            });
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const body = await res.text();
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle(`🌤️ Thời tiết tại ${city}`)
                .setDescription(body)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ 
                content: '❌ Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau!',
                ephemeral: true 
            });
        }
    }
};
