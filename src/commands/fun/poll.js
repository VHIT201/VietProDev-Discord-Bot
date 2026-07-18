const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const EMOJI_NUMBERS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Tạo bình chọn')
        .addStringOption(o => o.setName('question').setDescription('Câu hỏi bình chọn').setRequired(true))
        .addStringOption(o => o.setName('option1').setDescription('Lựa chọn 1').setRequired(true))
        .addStringOption(o => o.setName('option2').setDescription('Lựa chọn 2').setRequired(true))
        .addStringOption(o => o.setName('option3').setDescription('Lựa chọn 3').setRequired(false))
        .addStringOption(o => o.setName('option4').setDescription('Lựa chọn 4').setRequired(false))
        .addStringOption(o => o.setName('option5').setDescription('Lựa chọn 5').setRequired(false)),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = [];

        for (let i = 1; i <= 5; i++) {
            const opt = interaction.options.getString(`option${i}`);
            if (opt) options.push(opt);
        }

        const description = options
            .map((opt, i) => `${EMOJI_NUMBERS[i]} ${opt}`)
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`📊 ${question}`)
            .setDescription(description)
            .setFooter({ text: `Bình chọn bởi ${interaction.user.tag}` })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await message.react(EMOJI_NUMBERS[i]);
        }
    }
};
