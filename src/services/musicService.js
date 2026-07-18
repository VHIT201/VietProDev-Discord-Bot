const { Kazagumo, Plugins } = require('kazagumo');
const Shoukaku = require('shoukaku');
const { Connectors } = Shoukaku;
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

    // Debug: patch Shoukaku connector raw() to log all voice packets
    const origRaw = Object.getPrototypeOf(kazagumo.shoukaku.connector).raw;
    kazagumo.shoukaku.connector.constructor.prototype.raw = function(packet) {
        if (packet?.t === 'VOICE_STATE_UPDATE' || packet?.t === 'VOICE_SERVER_UPDATE') {
            Logger.info(`[CONNECTOR] raw ${packet.t} guild=${packet?.d?.guild_id} connections=${this.manager?.connections?.size} id=${this.manager?.id}`);
        }
        return origRaw.call(this, packet);
    };

    // Debug: log raw voice packets
    client.on('raw', (packet) => {
        if (packet?.t === 'VOICE_STATE_UPDATE' || packet?.t === 'VOICE_SERVER_UPDATE') {
            Logger.info(`[RAW] ${packet.t} guild=${packet?.d?.guild_id} user=${packet?.d?.user_id} connections=${kazagumo.shoukaku.connections.size} id=${kazagumo.shoukaku.id}`);
        }
    });

    // Debug: patch Connection.connect() to bypass events.once + AbortController bug on Node v24
    const OrigConnection = Shoukaku.Connection;
    OrigConnection.prototype.connect = async function() {
        if (this.state === 0 || this.state === 1) return;
        this.state = 0; // CONNECTING
        this.sendVoiceUpdate();
        Logger.info(`[VOICE] connect() sending OP4, waiting for connectionUpdate...`);
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.removeListener('connectionUpdate', handler);
                reject(new Error(`Voice connection timeout after ${this.manager.options.voiceConnectionTimeout}s`));
            }, this.manager.options.voiceConnectionTimeout * 1000);
            const handler = (status) => {
                clearTimeout(timeout);
                if (status === 0) { // SESSION_READY
                    this.state = 1; // CONNECTED
                    Logger.info(`[VOICE] connect() resolved SESSION_READY`);
                    resolve();
                } else {
                    reject(new Error(`Voice connection failed with status ${status}`));
                }
            };
            this.once('connectionUpdate', handler);
        });
    };

    // Patch Player.sendServerUpdate to add log and timeout
    const OrigPlayer = Shoukaku.Player;
    const origSendServerUpdate = OrigPlayer.prototype.sendServerUpdate;
    OrigPlayer.prototype.sendServerUpdate = async function(connection) {
        Logger.info(`[PLAYER] sendServerUpdate guild=${this.guildId} endpoint=${connection.serverUpdate?.endpoint} sessionId=${connection.sessionId}`);
        try {
            const result = await origSendServerUpdate.call(this, connection);
            Logger.info(`[PLAYER] sendServerUpdate resolved OK`);
            return result;
        } catch (err) {
            Logger.error(`[PLAYER] sendServerUpdate error: ${err.message}`);
            throw err;
        }
    };

    // Patch Rest.fetch to bypass AbortController bug on Node v24
    const OrigRest = Shoukaku.Rest;
    OrigRest.prototype.fetch = async function(fetchOptions) {
        const { endpoint, options } = fetchOptions;
        let headers = {
            "Authorization": this.auth,
            "User-Agent": this.node.manager.options.userAgent
        };
        if (options.headers) headers = { ...headers, ...options.headers };
        const url = new URL(`${this.url}${endpoint}`);
        if (options.params) url.search = new URLSearchParams(options.params).toString();
        const method = options.method?.toUpperCase() ?? "GET";
        const finalFetchOptions = { method, headers };
        if (!["GET", "HEAD"].includes(method) && options.body) {
            finalFetchOptions.body = JSON.stringify(options.body);
        }
        const timeoutMs = this.node.manager.options.restTimeout * 1000;
        const result = await Promise.race([
            fetch(url.toString(), finalFetchOptions),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`REST timeout after ${timeoutMs}ms: ${method} ${endpoint}`)), timeoutMs))
        ]);
        if (!result.ok) {
            const response = await result.json().catch(() => null);
            throw new Error(`REST error ${result.status}: ${JSON.stringify(response)}`);
        }
        try {
            return await result.json();
        } catch {
            return;
        }
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
