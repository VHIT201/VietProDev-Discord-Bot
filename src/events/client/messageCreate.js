const Logger = require('../../utils/logger');
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType 
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createCanvas } = require('canvas');

// --- CẤU HÌNH ---
const API_LICH_LAM = 'https://script.google.com/macros/s/AKfycbyyyw1iFVGy4tDUQ4kU21VV4UN9jj_RkQXlD5phlJhAOZRzoymBjJ4YzUqRB8wiQC1L/exec';
const RECENT_GREETINGS = new Set(); 

// Dữ liệu random
const RANDOM_DATA = {
    '!goisang': { icon: '🍜', title: 'Gợi ý ăn sáng', items: ['Phở bò', 'Bún riêu', 'Bánh mì ốp la', 'Xôi gà', 'Bánh cuốn', 'Cháo sườn', 'Hủ tiếu', 'Bún chả', 'Mì xào'] },
    '!goitrua': { icon: '🍚', title: 'Gợi ý ăn trưa', items: ['Cơm gà', 'Cơm sườn', 'Bún mắm', 'Cơm tấm', 'Phở', 'Mì quảng', 'Bún bò Huế', 'Cơm gà xối mỡ', 'Canh chua'] },
    '!douong': { icon: '🥤', title: 'Gợi ý đồ uống', items: ['Trà đá', 'Trà sữa', 'Cà phê sữa', 'Sinh tố bơ', 'Nước mía', 'Nước chanh leo', 'Soda', 'Matcha', 'Sữa đậu'] }
};

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message || !message.author || message.author.bot) return;
        const text = (message.content || '').trim().toLowerCase();

        try {
            // ====================================================
            // 1. GREETING (XIN CHAO)
            // ====================================================
            if (text === 'xin chao') {
                if (RECENT_GREETINGS.has(message.id)) return;
                RECENT_GREETINGS.add(message.id);
                setTimeout(() => RECENT_GREETINGS.delete(message.id), 5000);

                const candidates = [
                    path.join(__dirname, '..', '..', '..', 'assets', 'welcome-banner.png'),
                    path.join(__dirname, '..', '..', 'assets', 'welcome-banner.png'),
                    path.join(__dirname, '..', '..', 'assets', 'img', 'chaomungvietprodev.png'),
                ];
                let imgPath = candidates.find(p => fs.existsSync(p)) || null;

                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'VietProDev', iconURL: client?.user?.displayAvatarURL() })
                    .setTitle('Chào mừng đến với VietProDev')
                    .setDescription('Đơn vị hàng đầu trong phát triển phần mềm và đào tạo lập trình — giải pháp thực chiến, cam kết chất lượng và sáng tạo.')
                    .addFields(
                        { name: 'Về VietProDev', value: 'Chúng tôi cung cấp giải pháp phần mềm hiện đại và chương trình đào tạo theo dự án thực tế, nhằm đáp ứng nhu cầu doanh nghiệp và đào tạo lập trình viên chuyên nghiệp.', inline: false },
                        { name: 'Tầm nhìn', value: 'Trở thành đối tác công nghệ chiến lược tin cậy tại Việt Nam và khu vực.', inline: true },
                        { name: 'Sứ mệnh', value: 'Đồng hành cùng doanh nghiệp chuyển đổi số; ươm mầm lập trình viên sáng tạo và có trách nhiệm.', inline: true },
                        { name: 'Triết lý & Kinh doanh', value: 'Khách hàng là trọng tâm; chất lượng là kim chỉ nam; đổi mới liên tục và hợp tác cởi mở.', inline: false },
                        { name: 'Cam kết thực hiện', value: 'Giao giải pháp an toàn, minh bạch, kiểm thử theo tiêu chuẩn; hỗ trợ & kết nối nghề nghiệp cho học viên.', inline: false },
                        { name: 'Một số con số', value: '• 1,000+ Dự án triển khai\n• 500+ Khách hàng\n• 200+ Đối tác', inline: false },
                        { name: 'Liên hệ', value: '📍 L5-22, KDC Phú Gia, Trảng Dài, Biên Hòa\n☎️ 0354285685\n✉️ contact@vietprodev.vn\n🌐 https://vietprodev.vn', inline: false }
                    )
                    .setColor(0x0FB7A4)
                    .setFooter({ text: 'VietProDev • Học tập - Kết nối - Phát triển' })
                    .setTimestamp()
                    .setThumbnail(message.author?.displayAvatarURL?.({ size: 128 }));

                const components = [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder().setCustomId('intro_self').setLabel('Giới thiệu bản thân').setStyle(ButtonStyle.Primary),
                        new ButtonBuilder().setLabel('Trang chủ').setStyle(ButtonStyle.Link).setURL('https://vietprodev.vn'),
                        new ButtonBuilder().setLabel('Liên hệ').setStyle(ButtonStyle.Link).setURL('https://vietprodev.vn/lien-he/')
                    )
                ];

                if (imgPath) {
                    const fileName = path.basename(imgPath);
                    embed.setImage(`attachment://${fileName}`);
                    await message.reply({ embeds: [embed], files: [{ attachment: imgPath, name: fileName }], components });
                } else {
                    await message.reply({ embeds: [embed], components });
                }
                return;
            }

            // ====================================================
            // 2. TIỆN ÍCH (HỎI TÊN, THỜI TIẾT, ĐỒ ĂN)
            // ====================================================
            if (['ban ten la gi', 'ban la ai'].includes(text)) {
                return message.reply(`Tôi là bot hỗ trợ của **VietProDev**! 🤖`);
            }

            if (text.startsWith('!thoitiet')) {
                try {
                    const res = await axios.get(`https://wttr.in/Bien%20Hoa?format=3`, { timeout: 5000 });
                    return message.reply(`🌤️ **Thời tiết Biên Hòa:**\n\`\`\`${res.data}\`\`\``);
                } catch (e) { return message.reply('⚠️ Không lấy được thời tiết.'); }
            }

            if (RANDOM_DATA[text]) {
                const d = RANDOM_DATA[text];
                const pick = d.items[Math.floor(Math.random() * d.items.length)];
                return message.reply(`${d.icon} **${d.title}:** ${pick}`);
            }

            // ====================================================
            // 3. LỊCH LÀM VIỆC (INTERACTIVE BUTTONS)
            // ====================================================
            if (text.startsWith('!lichlam')) {
                // Tạo hàng nút bấm cho Ngày
                const rowDays = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('day_T2').setLabel('Thứ 2').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('day_T3').setLabel('Thứ 3').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('day_T4').setLabel('Thứ 4').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('day_T5').setLabel('Thứ 5').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('day_T6').setLabel('Thứ 6').setStyle(ButtonStyle.Secondary)
                );

                // Tạo hàng nút bấm cho Team
                const rowTeams = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('team_Front-end').setLabel('Front-End').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('team_Back-end').setLabel('Back-End').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('team_Tester').setLabel('Tester').setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('opt_All').setLabel('Xem Tất Cả').setStyle(ButtonStyle.Success)
                );

                // Gửi tin nhắn ban đầu
                const initialEmbed = new EmbedBuilder()
                    .setTitle('📅 Tra cứu Lịch làm việc Offline')
                    .setDescription('Vui lòng chọn **Ngày** hoặc **Team** bạn muốn xem bên dưới:')
                    .setColor(0x0FB7A4);

                const replyMsg = await message.reply({ 
                    embeds: [initialEmbed], 
                    components: [rowDays, rowTeams] 
                });

                // Tạo bộ lắng nghe sự kiện bấm nút (tồn tại trong 60 giây)
                const collector = replyMsg.createMessageComponentCollector({ 
                    componentType: ComponentType.Button, 
                    time: 60000 
                });

                collector.on('collect', async (interaction) => {
                    // Chỉ người gọi lệnh mới được bấm (Optional - bỏ dòng này nếu muốn ai cũng bấm được)
                    if (interaction.user.id !== message.author.id) {
                        return interaction.reply({ content: 'Chỉ người gọi lệnh mới được dùng menu này!', ephemeral: true });
                    }

                    // Báo cho Discord biết bot đang xử lý (để tránh lỗi "interaction failed")
                    await interaction.deferUpdate();

                    // Phân tích ID nút bấm
                    const [type, value] = interaction.customId.split('_');
                    let apiParams = { sheet: 'all', day: '' };
                    let titleText = '';

                    if (type === 'day') {
                        apiParams.day = value; // Vd: T2
                        titleText = `📅 Lịch Offline - ${value}`;
                    } else if (type === 'team') {
                        apiParams.sheet = value; // Vd: Front-end
                        titleText = `📅 Lịch Offline - Team ${value}`;
                    } else {
                        titleText = `📅 Lịch Offline - Toàn công ty`;
                    }

                    // Nếu bấm 'Xem Tất Cả' (opt_All), render ảnh bảng và gửi file
                    if (type === 'opt' && value === 'All') {
                        try {
                            const res2 = await axios.get(API_LICH_LAM, { params: apiParams, timeout: 10000 });
                            let data = res2.data;
                            if (typeof data === 'string') {
                                try { data = JSON.parse(data); } catch(e){}
                            }
                            if (!data || data.status !== 'success' || !data.data) {
                                await interaction.editReply({ content: '⚠️ Không lấy được dữ liệu để xuất ảnh.', components: [rowDays, rowTeams] });
                            } else {
                                const buffer = await renderScheduleImage(data.data, titleText, client);
                                await interaction.editReply({ content: null, files: [{ attachment: buffer, name: 'lichlam.png' }], components: [rowDays, rowTeams] });
                            }
                        } catch (e) {
                            Logger.error('Lỗi khi tạo ảnh lịch', e);
                            await interaction.editReply({ content: '⚠️ Lỗi khi tạo ảnh lịch.', components: [rowDays, rowTeams] });
                        }
                    } else {
                        // Gọi hàm lấy dữ liệu và trả embed (và paginate nếu cần)
                        const resultEmbed = await fetchScheduleData(apiParams, titleText);

                        // If embed has many fields, paginate them
                        const allFields = (resultEmbed && resultEmbed.data && resultEmbed.data.fields) ? resultEmbed.data.fields : [];
                        const fieldsPerPage = 6;
                        if (allFields.length <= fieldsPerPage) {
                            await interaction.editReply({ embeds: [resultEmbed], components: [rowDays, rowTeams] });
                        } else {
                            const pages = [];
                            for (let i = 0; i < allFields.length; i += fieldsPerPage) {
                                const pg = EmbedBuilder.from(resultEmbed);
                                pg.data.fields = allFields.slice(i, i + fieldsPerPage);
                                pages.push(pg);
                            }

                            const uid = `${Date.now()}_${Math.floor(Math.random()*1000)}`;
                            let pageIndex = 0;

                            const paginationRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setCustomId(`paginate_${uid}_prev`).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true),
                                new ButtonBuilder().setCustomId(`paginate_${uid}_next`).setLabel('▶').setStyle(ButtonStyle.Primary)
                            );

                            await interaction.editReply({ embeds: [pages[pageIndex]], components: [rowDays, rowTeams, paginationRow] });

                            // Collector on the original reply message to handle pagination
                            try {
                                const pagCollector = replyMsg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });
                                pagCollector.on('collect', async pagInt => {
                                    if (pagInt.user.id !== message.author.id) return pagInt.reply({ content: 'Chỉ người gọi lệnh mới được điều hướng trang này.', ephemeral: true });
                                    if (!pagInt.customId.startsWith(`paginate_${uid}_`)) return;
                                    await pagInt.deferUpdate();
                                    if (pagInt.customId.endsWith('_next')) pageIndex = Math.min(pages.length - 1, pageIndex + 1);
                                    if (pagInt.customId.endsWith('_prev')) pageIndex = Math.max(0, pageIndex - 1);

                                    const prevBtn = ButtonBuilder.from(paginationRow.components[0]).setDisabled(pageIndex === 0);
                                    const nextBtn = ButtonBuilder.from(paginationRow.components[1]).setDisabled(pageIndex === pages.length - 1);
                                    const newPagRow = new ActionRowBuilder().addComponents(prevBtn, nextBtn);

                                    await replyMsg.edit({ embeds: [pages[pageIndex]], components: [rowDays, rowTeams, newPagRow] });
                                });

                                pagCollector.on('end', async () => {
                                    const disabledPrev = ButtonBuilder.from(paginationRow.components[0]).setDisabled(true);
                                    const disabledNext = ButtonBuilder.from(paginationRow.components[1]).setDisabled(true);
                                    const disabledRow = new ActionRowBuilder().addComponents(disabledPrev, disabledNext);
                                    try { await replyMsg.edit({ components: [rowDays, rowTeams, disabledRow] }); } catch (e) {}
                                });
                            } catch (e) {
                                Logger.error('Pagination collector error', e);
                            }
                        }
                    }
                });

                // Khi hết giờ (60s), vô hiệu hóa các nút
                collector.on('end', () => {
                    const disabledRow1 = ActionRowBuilder.from(rowDays).setComponents(rowDays.components.map(b => ButtonBuilder.from(b).setDisabled(true)));
                    const disabledRow2 = ActionRowBuilder.from(rowTeams).setComponents(rowTeams.components.map(b => ButtonBuilder.from(b).setDisabled(true)));
                    replyMsg.edit({ components: [disabledRow1, disabledRow2] }).catch(() => {});
                });

                return;
            }

        } catch (error) {
            Logger.error('Lỗi MessageCreate', error);
        }
    }
};

// --- HÀM RIÊNG: GỌI API & FORMAT DỮ LIỆU ---
async function fetchScheduleData(params, title) {
    try {
        const res = await axios.get(API_LICH_LAM, {
            params: params,
            headers: { 'User-Agent': 'VietProDev-Bot' },
            timeout: 10000
        });

        // Xử lý dữ liệu trả về (kể cả khi Google trả về string)
        let data = res.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) {}
        }

        if (data.status !== 'success' || !data.data) {
            return new EmbedBuilder().setDescription('⚠️ Không lấy được dữ liệu từ hệ thống.').setColor('Red');
        }

        const teams = data.data;
        const allNames = new Set();
        const fields = [];

        if (!teams || Object.keys(teams).length === 0) {
            return new EmbedBuilder()
                .setTitle(title)
                .setDescription('❌ Không có nhân sự nào đăng ký Offline theo yêu cầu.')
                .setColor(0xFF6B6B)
                .setTimestamp();
        }

        const weekdays = ['T2','T3','T4','T5','T6'];

        // If a specific day is requested (params.day), show Sáng/Chiều for that day only.
        const requestedDay = params && params.day ? params.day : null;

        for (const [teamName, schedule] of Object.entries(teams)) {
            const teamSet = new Set();

            if (requestedDay) {
                const morningKey = `${requestedDay} Sáng`;
                const afternoonKey = `${requestedDay} Chiều`;
                const morningArr = Array.isArray(schedule[morningKey]) ? schedule[morningKey].map(s=>s.trim()).filter(Boolean) : [];
                const afternoonArr = Array.isArray(schedule[afternoonKey]) ? schedule[afternoonKey].map(s=>s.trim()).filter(Boolean) : [];

                for (const n of morningArr) { teamSet.add(n); allNames.add(n); }
                for (const n of afternoonArr) { teamSet.add(n); allNames.add(n); }

                const morning = morningArr.length ? morningArr.join(', ') : '—';
                const afternoon = afternoonArr.length ? afternoonArr.join(', ') : '—';

                // Add two inline fields for better grid-like display
                fields.push({ name: `${teamName} — Sáng`, value: morning, inline: true });
                fields.push({ name: `${teamName} — Chiều`, value: afternoon, inline: true });
            } else {
                // Aggregate across weekdays: show short per-day lists under Sáng/Chiều columns
                const morningByDay = [];
                const afternoonByDay = [];
                for (const day of weekdays) {
                    const m = Array.isArray(schedule[`${day} Sáng`]) ? schedule[`${day} Sáng`].map(s=>s.trim()).filter(Boolean) : [];
                    const a = Array.isArray(schedule[`${day} Chiều`]) ? schedule[`${day} Chiều`].map(s=>s.trim()).filter(Boolean) : [];
                    morningByDay.push(`${day}: ${m.length ? m.join(', ') : '—'}`);
                    afternoonByDay.push(`${day}: ${a.length ? a.join(', ') : '—'}`);
                    for (const n of m) { teamSet.add(n); allNames.add(n); }
                    for (const n of a) { teamSet.add(n); allNames.add(n); }
                }

                const morning = morningByDay.join('\n');
                const afternoon = afternoonByDay.join('\n');
                fields.push({ name: `🔰 ${teamName} — Số: ${teamSet.size}`, value: '\u200B', inline: false });
                fields.push({ name: 'Sáng', value: morning, inline: true });
                fields.push({ name: 'Chiều', value: afternoon, inline: true });
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(0x0FB7A4)
            .setTimestamp()
            .setFooter({ text: `Tổng nhân sự hôm nay: ${allNames.size} người •` });

        // add fields in batches (Discord allows up to 25 fields)
        embed.addFields(...fields.slice(0, 25));
        return embed;

    } catch (err) {
        console.error('API Error:', err.message);
        return new EmbedBuilder()
            .setTitle('⚠️ Lỗi kết nối')
            .setDescription('Không thể kết nối đến Google. Vui lòng thử lại sau.')
            .setColor('Red');
    }
}

// Render schedule data as a PNG image (simple, clean table-like blocks)
async function renderScheduleImage(teams, title, client) {
    const padding = 24;
    const teamNames = Object.keys(teams);
    const weekdays = ['T2','T3','T4','T5','T6'];

    const colWidth = 220;
    const teamColWidth = 240;
    const width = Math.min(2000, teamColWidth + weekdays.length * 2 * colWidth + padding * 2);

    // height: header + team blocks
    const rowH = 26;
    const headerH = 80;
    const teamBlockH = (weekdays.length + 1) * rowH + 18; // +1 for header row in each block
    const height = headerH + teamNames.length * teamBlockH + padding * 2;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = '#0FB7A4';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Sans';
    ctx.fillText(title || 'Lịch làm việc', padding, 44);
    ctx.font = '14px Sans';
    ctx.fillText(`VietProDev • Xuất tự động`, padding, 64);

    // Draw each team block
    let y = headerH + padding;
    ctx.font = 'bold 16px Sans';
    for (const teamName of teamNames) {
        // block background
        ctx.fillStyle = '#F4F6F8';
        ctx.fillRect(padding, y, width - padding * 2, teamBlockH - 8);

        // team title
        ctx.fillStyle = '#0B2948';
        ctx.fillText(teamName, padding + 8, y + rowH - 6);

        // column headers
        ctx.font = '600 12px Sans';
        let cx = padding + teamColWidth;
        ctx.fillStyle = '#333';
        for (const day of weekdays) {
            ctx.fillText(`${day} Sáng`, cx + 4, y + rowH - 6);
            ctx.fillText(`${day} Chiều`, cx + colWidth + 4, y + rowH - 6);
            cx += colWidth * 2;
        }

        // rows per weekday
        ctx.font = '12px Sans';
        let ry = y + rowH + 6;
        for (const day of weekdays) {
            const morning = Array.isArray(teams[teamName][`${day} Sáng`]) ? teams[teamName][`${day} Sáng`].join(', ') : '';
            const afternoon = Array.isArray(teams[teamName][`${day} Chiều`]) ? teams[teamName][`${day} Chiều`].join(', ') : '';

            // Team column (day label)
            ctx.fillStyle = '#444';
            ctx.fillText(day, padding + 8, ry + 8);

            // morning
            cx = padding + teamColWidth;
            ctx.fillStyle = '#222';
            wrapText(ctx, morning || '—', cx + 4, ry + 8, colWidth - 8, rowH);

            // afternoon
            cx += colWidth;
            wrapText(ctx, afternoon || '—', cx + 4, ry + 8, colWidth - 8, rowH);

            ry += rowH;
        }

        y += teamBlockH;
        ctx.font = 'bold 16px Sans';
    }

    return canvas.toBuffer('image/png');
}

// simple wrap text into one line (truncate with ellipsis)
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) { ctx.fillText('\u2014', x, y); return; }
    let out = text;
    while (ctx.measureText(out).width > maxWidth) {
        out = out.slice(0, -1);
        if (out.length <= 3) break;
    }
    if (out.length < text.length) out = out.slice(0, -3) + '...';
    ctx.fillText(out, x, y);
}