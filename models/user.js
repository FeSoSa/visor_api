const mongoose = require('mongoose');

// Esquema para o usuário
const userSchema = new mongoose.Schema({
    registry: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    token: { type: String, required: true },
    role: { type: String, enum: ['admin', 'player'], default: 'player' },
    createdAt: { type: Date, default: Date.now },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
});

module.exports = mongoose.model('User', userSchema);
