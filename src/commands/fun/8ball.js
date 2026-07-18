const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const RESPONSES = [
    // Tích cực
    '✅ Chắc chắn rồi!',
    '✅ Đúng vậy!',
    '✅ Theo quan điểm của tôi, có.',
    '✅ Rõ ràng là có.',
    '✅ Bạn có thể tin tưởng vào điều đó.',
    // Trung lập
    '🔄 Câu trả lời chưa rõ ràng, hãy thử lại.',
    '🔄 Hãy hỏi lại sau.',
    '🔄 Tốt hơn là không nói ngay bây giờ.',
    '🔄 Tập trung lại rồi hỏi lại sau.',
    // Tiêu cực
    '❌ Đừng trông chờ vào điều đó.',
    '❌ Câu trả lời của tôi là không.',
    '❌ Nguồn tin của tôi nói không.',
    '❌ Triển vọng không tốt lắm.',
    '❌ Rất đáng ngờ.',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Hỏi quả cầu ma thuật 🎱')
        .addStringOption(o =>
            o.setName('question')
                .setDescription('Câu hỏi của bạn')
                .setRequired(true)
        ),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

        const embed = new EmbedBuilder()
            .setColor(0x2C2F33)
            .setTitle('🎱 Quả cầu ma thuật')
            .addFields(
                { name: '❓ Câu hỏi', value: question },
                { name: '🔮 Câu trả lời', value: response }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
