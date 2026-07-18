const { EmbedBuilder } = require('discord.js');

function formatDuration(ms) {
    if (!ms || ms === 0) return '0:00';
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function createNowPlayingEmbed(track, player) {
    const embed = new EmbedBuilder()
        .setColor(0x1DB954)
        .setTitle('🎵 Đang phát')
        .setDescription(`**[${track.title}](${track.uri || track.url || 'https://example.com'})**`)
        .addFields(
            { name: '👤 Nghệ sĩ', value: track.author || 'Unknown', inline: true },
            { name: '⏱️ Thời lượng', value: formatDuration(track.length), inline: true },
            { name: '🔊 Âm lượng', value: `${player.volume}%`, inline: true }
        )
        .setTimestamp();

    if (track.thumbnail) {
        embed.setThumbnail(track.thumbnail);
    }

    if (track.sourceName === 'spotify') {
        embed.setFooter({ text: 'Nguồn: Spotify' });
    } else if (track.sourceName === 'applemusic') {
        embed.setFooter({ text: 'Nguồn: Apple Music' });
    } else if (track.sourceName === 'deezer') {
        embed.setFooter({ text: 'Nguồn: Deezer' });
    } else if (track.sourceName === 'soundcloud') {
        embed.setFooter({ text: 'Nguồn: SoundCloud' });
    } else {
        embed.setFooter({ text: 'Nguồn: YouTube' });
    }

    return embed;
}

function createQueueEmbed(player, page = 0, pageSize = 10) {
    const current = player.queue.current;
    const queue = player.queue;

    const totalPages = Math.max(1, Math.ceil(queue.length / pageSize));
    const currentPage = Math.min(page, totalPages - 1);

    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, queue.length);
    const tracks = queue.slice(start, end);

    let description = '';

    if (current) {
        description += `**🎵 Đang phát:**\n**[${current.title}](${current.uri || 'https://example.com'})** - \`${formatDuration(current.length)}\`\n\n`;
    }

    if (tracks.length > 0) {
        description += `**📋 Hàng đợi (trang ${currentPage + 1}/${totalPages}):**\n`;
        tracks.forEach((track, i) => {
            const index = start + i + 1;
            description += `**${index}.** [${track.title}](${track.uri || 'https://example.com'}) - \`${formatDuration(track.length)}\`\n`;
        });
    } else if (!current) {
        description = 'Hàng đợi trống!';
    }

    const totalDuration = queue.reduce((sum, t) => sum + (t.length || 0), 0) + (current?.length || 0);

    const embed = new EmbedBuilder()
        .setColor(0x1DB954)
        .setTitle('🎼 Hàng đợi nhạc')
        .setDescription(description)
        .addFields(
            { name: '📊 Tổng bài', value: `${queue.length + (current ? 1 : 0)}`, inline: true },
            { name: '⏱️ Tổng thời lượng', value: formatDuration(totalDuration), inline: true },
            { name: '🔊 Âm lượng', value: `${player.volume}%`, inline: true }
        )
        .setTimestamp();

    return embed;
}

module.exports = { formatDuration, createNowPlayingEmbed, createQueueEmbed };
