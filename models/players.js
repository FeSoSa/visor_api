const mongoose = require('mongoose');
const { Schema } = mongoose;

// Magazine Slot Schema
const MagazineSlotSchema = new Schema({
    bullets: { type: Number, required: true },
    type: { type: String, enum: ['H', 'M', 'L', 'I'], required: true },
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
    type: { type: String, enum: ['H', 'M', 'L', 'SH'], required: true },
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
    type: { type: String, enum: ['H', 'M', 'L', 'I'], required: true },
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
const PlayerSchema = new Schema({
    userRegistry: { type: String, required: true },
    registry: { type: String, required: true },
    name: { type: String, required: true },
    codename: { type: String, required: true },
    photo: { type: String, required: false },
    status: { type: String, required: true },
    class: { type: String, enum: ['sniper', 'assault', 'engeneer', 'medic', 'inteligence'], required: true },
    gunSelected: { type: String, enum: ['primary', 'secondary'] },

    maxHp: { type: Number, required: true },
    hp: { type: Number, required: true },
    armor: { type: ArmorSchema, required: true },
    magazines: { type: MagazinesSchema, required: true },
    guns: { type: GunsSchema, required: true },
    utilitaries: { type: [ItemSchema], required: true },
    items: { type: [ItemSchema], required: true },
});

module.exports = mongoose.model('Player', PlayerSchema);