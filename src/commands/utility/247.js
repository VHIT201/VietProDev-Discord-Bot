const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/247.json');

function load247Data() {
    try {
        if (fs.existsSync(dataFile)) {
            return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        }
    } catch (e) {}
    return {};
}

function save247Data(data) {
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Bật/tắt chế độ bot ở voice channel 24/7')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Bật hoặc tắt chế độ 24/7')
                .setRequired(true)
                .addChoices(
                    { name: 'Bật - Bot ở lại channel 24/7', value: 'join' },
                    { name: 'Tắt - Bot rời channel', value: 'leave' },
                )),

    async execute(interaction, client) {
        await interaction.deferReply();

        const action = interaction.options.getString('action');
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (action === 'join') {
            if (!voiceChannel) {
                return interaction.editReply('❌ Bạn cần ở trong voice channel trước khi dùng lệnh này!');
            }

            try {
                await voiceChannel.join();
            } catch (e) {
                return interaction.editReply(`❌ Không thể join voice channel: ${e.message}`);
            }

            const data = load247Data();
            data[interaction.guildId] = {
                channelId: voiceChannel.id,
                enabled: true,
            };
            save247Data(data);

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Đã bật chế độ 24/7')
                .setDescription(`Bot sẽ ở lại **${voiceChannel.name}** 24/7 và tự động join lại nếu bị disconnect.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (action === 'leave') {
            const data = load247Data();
            delete data[interaction.guildId];
            save247Data(data);

            const connection = interaction.guild.members.me.voice.channel;
            if (connection) {
                try {
                    connection.leave();
                } catch (e) {}
            }

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('✅ Đã tắt chế độ 24/7')
                .setDescription('Bot đã rời voice channel và sẽ không tự động join lại nữa.')
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
