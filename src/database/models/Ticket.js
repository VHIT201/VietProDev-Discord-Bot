const { Schema, model } = require('mongoose');

/**
 * Schema Ticket - Hệ thống ticket support
 */
const ticketSchema = new Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    channelId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    
    // Thông tin ticket
    category: {
        type: String,
        enum: ['support', 'hr', 'it', 'other'],
        default: 'support'
    },
    subject: String,
    description: String,
    
    // Trạng thái
    status: {
        type: String,
        enum: ['open', 'in-progress', 'waiting', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    // Người xử lý
    assignedTo: String,
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    closedAt: Date
});

ticketSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = model('Ticket', ticketSchema);
