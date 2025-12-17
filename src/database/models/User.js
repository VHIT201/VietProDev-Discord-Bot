const { Schema, model } = require('mongoose');

/**
 * Schema User - Lưu thông tin nhân viên
 */
const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    displayName: String,
    
    // Thông tin HR
    employeeId: String,
    department: String,
    position: String,
    startDate: Date,
    
    // Thông tin nghỉ phép
    annualLeave: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 }
    },
    
    // Điểm tích lũy, level game
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    
    // Stats
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware tự động cập nhật updatedAt
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = model('User', userSchema);
