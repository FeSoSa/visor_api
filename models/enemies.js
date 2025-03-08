const mongoose = require('mongoose');
const { Schema } = mongoose;

// Magazine Slot Schema
const MagazineSlotSchema = new Schema({
    bullets: { type: Number, required: true },
    type: { type: String, enum: ['H', 'M', 'L', 'I', 'E'], required: true },
    capacity: { type: Number, required: true },
    _id: { type: String, required: false },
    desc: { type: String, required: false },
});

// Magazines Schema
const MagazinesSchema = new Schema({
    primary: [MagazineSlotSchema],
    secondary: [MagazineSlotSchema],
});

// Armor Schema
const ArmorSchema = new Schema({
    type: { type: String, enum: ['H', 'M', 'L', 'SH', ' '], required: true },
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    slots: { type: Number, required: true },
    desc: { type: String, required: false },
});

// Gun Schema
const GunSchema = new Schema({
    url: { type: String, required: false },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    magazineSelected: { type: Number, required: true },
    type: { type: String, enum: ['H', 'M', 'L', 'I', 'E'], required: true },
    mod: { type: Number, required: true },
    desc: { type: String, required: false },
});

// Guns Schema
const GunsSchema = new Schema({
    primary: GunSchema,
    secondary: GunSchema,
});

// Item Schema
const ItemSchema = new Schema({
    url: { type: String, required: false },
    name: { type: String, required: true },
    desc: { type: String, required: false },
    quantity: { type: Number, required: true },
    usable: { type: Boolean, required: true },
    type: { type: String, enum: ['grenade', 'item'], required: true },
    rechargeable: { type: Boolean, required: false },
    reloading: { type: Boolean, required: false },
    value: { type: Number, required: false },
});

// Player Schema
const EnemieSchema = new Schema({
    obs: { type: String, required: false },
    name: { type: String, required: true },

    maxHp: { type: Number, required: true },
    hp: { type: Number, required: true },
    armor: { type: ArmorSchema, required: true },
    magazines: { type: [MagazineSlotSchema], required: true },
    gun: { type: GunSchema, required: true },
    items: { type: [ItemSchema], required: true },
});

module.exports = mongoose.model('Enemie', EnemieSchema);