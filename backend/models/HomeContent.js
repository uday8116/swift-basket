const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['brand', 'category']
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    discount: {
        type: String,
        default: 'UP TO 60% OFF'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
homeContentSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model('HomeContent', homeContentSchema);
