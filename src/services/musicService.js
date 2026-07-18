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
        nodes,
        {
            voiceConnectionTimeout: 30000,
            resume: false,
            reconnectTries: 3,
            restTimeout: 30000,
        }
    );

    // Debug: log raw voice packets
    client.on('raw', (packet) => {
        if (packet?.t === 'VOICE_STATE_UPDATE' || packet?.t === 'VOICE_SERVER_UPDATE') {
            Logger.info(`[RAW] ${packet.t} guild=${packet?.d?.guild_id} user=${packet?.d?.user_id} connections=${kazagumo.shoukaku.connections.size} id=${kazagumo.shoukaku.id}`);
        }
    });

    // Debug: patch Connection to log sendVoiceUpdate
    const Shoukaku = require('shoukaku');
    const OrigConnection = Shoukaku.Connection;
    const origSendVoiceUpdate = OrigConnection.prototype.sendVoiceUpdate;
    OrigConnection.prototype.sendVoiceUpdate = function() {
        Logger.info(`[VOICE] sendVoiceUpdate guild=${this.guildId} channel=${this.channelId} state=${this.state} sessionId=${this.sessionId}`);
        return origSendVoiceUpdate.call(this);
    };
    const origSetServerUpdate = OrigConnection.prototype.setServerUpdate;
    OrigConnection.prototype.setServerUpdate = function(data) {
        Logger.info(`[VOICE] setServerUpdate guild=${this.guildId} endpoint=${data?.endpoint} sessionId=${this.sessionId}`);
        return origSetServerUpdate.call(this, data);
    };
    const origSetStateUpdate = OrigConnection.prototype.setStateUpdate;
    OrigConnection.prototype.setStateUpdate = function(data) {
        Logger.info(`[VOICE] setStateUpdate guild=${this.guildId} session_id=${data?.session_id} channel_id=${data?.channel_id}`);
        return origSetStateUpdate.call(this, data);
    };

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
