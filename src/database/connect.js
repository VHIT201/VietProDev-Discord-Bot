const { connect } = require('mongoose');
const Logger = require('../utils/logger');

/**
 * Kết nối MongoDB với Mongoose
 * @param {string} uri - MongoDB connection string
 */
async function connectDatabase(uri) {
    try {
        await connect(uri, {
            // Các options chuẩn
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        Logger.success('Đã kết nối MongoDB thành công');
    } catch (error) {
        Logger.error('Không thể kết nối MongoDB', error);
        process.exit(1);
    }
}

module.exports = { connectDatabase };
