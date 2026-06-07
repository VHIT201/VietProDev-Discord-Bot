/**
 * Canvas renderer cho lịch làm việc
 * Sử dụng @napi-rs/canvas thay vì canvas gốc để tránh lỗi build trên Windows
 */

let Canvas = null;
let createCanvas = null;

// Lazy load canvas để tránh crash khi khởi động
function loadCanvas() {
    if (createCanvas) return;
    
    try {
        // Thử @napi-rs/canvas trước (không cần build native)
        const napiCanvas = require('@napi-rs/canvas');
        createCanvas = napiCanvas.createCanvas;
        Canvas = napiCanvas;
    } catch (e) {
        try {
            // Fallback sang canvas gốc
            const canvas = require('canvas');
            createCanvas = canvas.createCanvas;
            Canvas = canvas;
        } catch (e2) {
            throw new Error('Không thể load canvas. Cần cài @napi-rs/canvas hoặc canvas');
        }
    }
}

/**
 * Render dữ liệu lịch làm việc thành ảnh PNG
 * @param {Object} teams - Dữ liệu teams
 * @param {string} title - Tiêu đề ảnh
 * @param {Object} client - Discord Client
 * @returns {Promise<Buffer>} Buffer PNG
 */
async function renderScheduleImage(teams, title, client) {
    loadCanvas();
    
    const padding = 24;
    const teamNames = Object.keys(teams);
    const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6'];

    const colWidth = 220;
    const teamColWidth = 240;
    const width = Math.min(2000, teamColWidth + weekdays.length * 2 * colWidth + padding * 2);

    const rowH = 26;
    const headerH = 80;
    const teamBlockH = (weekdays.length + 1) * rowH + 18;
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
    ctx.fillText(' • Xuất tự động', padding, 64);

    // Draw each team block
    let y = headerH + padding;
    ctx.font = 'bold 16px Sans';
    
    for (const teamName of teamNames) {
        ctx.fillStyle = '#F4F6F8';
        ctx.fillRect(padding, y, width - padding * 2, teamBlockH - 8);

        ctx.fillStyle = '#0B2948';
        ctx.fillText(teamName, padding + 8, y + rowH - 6);

        ctx.font = '600 12px Sans';
        let cx = padding + teamColWidth;
        ctx.fillStyle = '#333';
        
        for (const day of weekdays) {
            ctx.fillText(`${day} Sáng`, cx + 4, y + rowH - 6);
            ctx.fillText(`${day} Chiều`, cx + colWidth + 4, y + rowH - 6);
            cx += colWidth * 2;
        }

        ctx.font = '12px Sans';
        let ry = y + rowH + 6;
        
        for (const day of weekdays) {
            const morning = Array.isArray(teams[teamName][`${day} Sáng`]) ? teams[teamName][`${day} Sáng`].join(', ') : '';
            const afternoon = Array.isArray(teams[teamName][`${day} Chiều`]) ? teams[teamName][`${day} Chiều`].join(', ') : '';

            ctx.fillStyle = '#444';
            ctx.fillText(day, padding + 8, ry + 8);

            cx = padding + teamColWidth;
            ctx.fillStyle = '#222';
            wrapText(ctx, morning || '—', cx + 4, ry + 8, colWidth - 8, rowH);

            cx += colWidth;
            wrapText(ctx, afternoon || '—', cx + 4, ry + 8, colWidth - 8, rowH);

            ry += rowH;
        }

        y += teamBlockH;
        ctx.font = 'bold 16px Sans';
    }

    return canvas.toBuffer('image/png');
}

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

module.exports = {
    renderScheduleImage
};
