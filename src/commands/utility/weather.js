const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getWeather, getWeatherDescription } = require('../../services/weatherService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Xem thời tiết theo thành phố')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('Tên thành phố (VD: Ho Chi Minh, Ha Noi, Da Nang)')
                .setRequired(true)
                .setMaxLength(100)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const city = interaction.options.getString('city');

        try {
            const weather = await getWeather(city);
            const description = getWeatherDescription(weather.weathercode);

            const embed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setTitle(`🌤️ Thời tiết ${weather.city}${weather.country ? `, ${weather.country}` : ''}`)
                .setDescription(description)
                .addFields(
                    { name: '🌡️ Nhiệt độ', value: `${weather.temperature}°C`, inline: true },
                    { name: '📈 Cao nhất', value: `${weather.maxTemp}°C`, inline: true },
                    { name: '📉 Thấp nhất', value: `${weather.minTemp}°C`, inline: true },
                    { name: '💨 Gió', value: `${weather.windspeed} km/h`, inline: true }
                )
                .setFooter({ text: 'Powered by Open-Meteo • Miễn phí 100%' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({
                content: `❌ ${error.message}`,
                ephemeral: true
            });
        }
    }
};
