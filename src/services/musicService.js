const { Kazagumo, Plugins } = require('kazagumo');
const { Connectors } = require('shoukaku');
const Logger = require('../utils/logger');

let kazagumo = null;

function createKazagumo(client) {
    const nodes = [
        {
            name: 'Lavalink',
            url: `${process.env.LAVALINK_HOST || 'localhost'}:${process.env.LAVALINK_PORT || 2333}`,
            auth: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
            secure: process.env.LAVALINK_SECURE === 'true',
        }
    ];

    kazagumo = new Kazagumo(
        {
            plugins: [
                new Plugins.PlayerMoved(client),
            ],
            defaultSearchEngine: 'youtube',
            defaultVolume: 100,
        },
        new Connectors.DiscordJS(client),
        nodes
    );

    kazagumo.shoukaku.on('ready', (name) => {
        Logger.success(`Lavalink node "${name}" đã kết nối`);
    });

    kazagumo.shoukaku.on('error', (name, error) => {
        Logger.error(`Lavalink node "${name}" lỗi:`, error);
    });

    kazagumo.shoukaku.on('close', (name, code, reason) => {
        Logger.warn(`Lavalink node "${name}" đóng: code ${code}, reason: ${reason}`);
    });

    kazagumo.shoukaku.on('disconnect', (name, count) => {
        Logger.warn(`Lavalink node "${name}" ngắt kết nối, ${count} players bị ảnh hưởng`);
    });

    kazagumo.on('playerStart', (player) => {
        const track = player.queue.current;
        if (track) {
            Logger.info(`▶️ Bắt đầu phát: ${track.title} - ${track.author || 'Unknown'}`);
        }
    });

    kazagumo.on('playerEnd', (player) => {
        if (player.queue.length === 0 && !player.queue.current) {
            Logger.info(`⏹️ Hàng đợi trống, dừng player`);
        }
    });

    kazagumo.on('playerEmpty', (player) => {
        Logger.info(`⏹️ Hàng đợi trống trong guild ${player.guildId}`);
    });

    kazagumo.on('playerException', (player, error) => {
        Logger.error(`Lỗi player trong guild ${player.guildId}:`, error);
    });

    kazagumo.on('playerUpdate', (player) => {
    });

    kazagumo.on('playerResolveError', (player, track, error) => {
        Logger.error(`Không thể resolve track "${track?.title}":`, error);
    });

    return kazagumo;
}

function getKazagumo() {
    return kazagumo;
}

module.exports = { createKazagumo, getKazagumo };
