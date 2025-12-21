const fs = require('fs');
const path = require('path');

/**
 * Đọc tất cả file .js trong thư mục (đệ quy)
 * @param {string} dir - Đường dẫn thư mục
 * @returns {Array<string>} - Mảng đường dẫn file tuyệt đối
 */
function loadFiles(dir) {
    const files = [];
    
    // If directory doesn't exist, return empty list (prevents ENOENT)
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
            // Đệ quy vào thư mục con
            files.push(...loadFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

module.exports = { loadFiles };
