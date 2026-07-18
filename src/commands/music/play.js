const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');
const { formatDuration } = require('../../utils/musicUtils');
const Logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát nhạc từ YouTube, Spotify, SoundCloud, Apple Music, Deezer')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Tên bài hát, link YouTube/Spotify/SoundCloud/Apple Music/Deezer')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '❌ Bạn cần vào voice channel trước!', ephemeral: true });
        }

        const kazagumo = getKazagumo();
        if (!kazagumo) {
            return interaction.reply({ content: '❌ Lavalink chưa kết nối! Vui lòng kiểm tra server Lavalink.', ephemeral: true });
        }

        await interaction.deferReply();

        let player = kazagumo.getPlayer(interaction.guild.id);

        try {
            if (!player) {
                Logger.info(`Tạo player mới: guild=${interaction.guild.id}, voice=${voiceChannel.id}, text=${interaction.channel.id}`);
                
                const createPromise = kazagumo.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: voiceChannel.id,
                    textId: interaction.channel.id,
                    deaf: false,
                });
                
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout tạo player sau 30s')), 30000)
                );
                
                player = await Promise.race([createPromise, timeoutPromise]);
                Logger.info(`Player tạo thành công: ${player.guildId}`);
            } else if (player.voiceId !== voiceChannel.id) {
                return interaction.editReply({ content: '❌ Bạn cần ở cùng voice channel với bot!', ephemeral: true });
            }
        } catch (connError) {
            Logger.error('Lỗi kết nối voice:', connError);
            return interaction.editReply({ content: `❌ Không thể kết nối voice channel: ${connError.message}` });
        }

        try {
            const result = await player.search(query, { requester: interaction.user });
            Logger.info(`Search result: ${result?.tracks?.length || 0} tracks, type: ${result?.type}`);

            if (!result || result.tracks.length === 0) {
                return interaction.editReply({ content: `❌ Không tìm thấy kết quả cho: **${query}**` });
            }

            const isPlaylist = result.type === 'PLAYLIST';
            const track = result.tracks[0];

            if (isPlaylist) {
                player.queue.add(result.tracks);
                const embed = new EmbedBuilder()
                    .setColor(0x1DB954)
                    .setTitle('📋 Đã thêm playlist vào hàng đợi')
                    .setDescription(`**${result.playlistName || 'Playlist'}** - ${result.tracks.length} bài`)
                    .addFields(
                        { name: '👤 Yêu cầu bởi', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed] });
            } else {
                player.queue.add(track);
                const embed = new EmbedBuilder()
                    .setColor(0x1DB954)
                    .setTitle('➕ Đã thêm vào hàng đợi')
                    .setDescription(`**[${track.title}](${track.uri || 'https://example.com'})**`)
                    .addFields(
                        { name: '👤 Nghệ sĩ', value: track.author || 'Unknown', inline: true },
                        { name: '⏱️ Thời lượng', value: formatDuration(track.length), inline: true },
                        { name: '👤 Yêu cầu bởi', value: interaction.user.tag, inline: true }
                    )
                    .setTimestamp();

                if (track.thumbnail) embed.setThumbnail(track.thumbnail);

                await interaction.editReply({ embeds: [embed] });
            }

            if (!player.playing && !player.paused) {
                Logger.info(`Bắt đầu phát: ${track.title}`);
                await player.play();
                Logger.info(`play() đã gọi xong`);
            }
        } catch (error) {
            Logger.error('Lỗi khi search/play:', error);
            await interaction.editReply({ content: `❌ Lỗi khi phát nhạc: ${error.message}` });
        }
    }
};
