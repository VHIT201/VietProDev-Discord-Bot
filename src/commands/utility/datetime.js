const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TIMEZONES = [
    { name: '🇻🇳 Việt Nam (GMT+7)', value: 'Asia/Ho_Chi_Minh' },
    { name: '🇯🇵 Nhật Bản (GMT+9)', value: 'Asia/Tokyo' },
    { name: '🇺🇸 Mỹ - EST (GMT-5)', value: 'America/New_York' },
    { name: '🇺🇸 Mỹ - PST (GMT-8)', value: 'America/Los_Angeles' },
    { name: '🇬🇧 Anh (GMT+0)', value: 'Europe/London' },
    { name: '🇩🇪 Đức (GMT+1)', value: 'Europe/Berlin' },
    { name: '🇦🇺 Sydney (GMT+11)', value: 'Australia/Sydney' },
    { name: '🇰🇷 Hàn Quốc (GMT+9)', value: 'Asia/Seoul' },
    { name: '🇸🇬 Singapore (GMT+8)', value: 'Asia/Singapore' },
    { name: 'UTC', value: 'UTC' },
];

const WEEKDAYS_VN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getTimezoneOffset(timezone) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(now);
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        return tzPart ? tzPart.value : '';
    } catch {
        return '';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('datetime')
        .setDescription('Xem ngày tháng và giờ hiện tại')
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('Chọn múi giờ (mặc định: Việt Nam)')
                .setRequired(false)
                .addChoices(TIMEZONES.map(tz => ({ name: tz.name, value: tz.value })))
        ),

    async execute(interaction) {
        const timezone = interaction.options.getString('timezone') || 'Asia/Ho_Chi_Minh';
        const now = new Date();

        const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: timezone,
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const fullDateFormatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: timezone,
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const dateString = dateFormatter.format(now);
        const timeString = timeFormatter.format(now);
        const fullDate = fullDateFormatter.format(now);
        const offset = getTimezoneOffset(timezone);
        const weekNumber = getWeekNumber(now);

        const localTimeInTz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const weekdayIndex = localTimeInTz.getDay();
        const weekdayVN = WEEKDAYS_VN[weekdayIndex];

        const isVn = timezone === 'Asia/Ho_Chi_Minh';
        const tzLabel = TIMEZONES.find(t => t.value === timezone)?.name || timezone;

        const embed = new EmbedBuilder()
            .setColor(isVn ? 0x5865F2 : 0x3498DB)
            .setTitle('🕐 Ngày tháng & Giờ')
            .addFields(
                { name: '📅 Ngày', value: `**${fullDate}**`, inline: true },
                { name: '📆 Thứ', value: `**${weekdayVN}**`, inline: true },
                { name: '⏰ Giờ', value: `**${timeString}**`, inline: true },
                { name: '🔢 Tuần thứ', value: `**${weekNumber}** trong năm`, inline: true },
                { name: '🌍 Múi giờ', value: `${tzLabel}${offset ? ` (${offset})` : ''}`, inline: true },
                { name: '📊 Unix timestamp', value: `**${Math.floor(now.getTime() / 1000)}**`, inline: true }
            )
            .setFooter({ text: `Cập nhật lúc ${now.toISOString()}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
