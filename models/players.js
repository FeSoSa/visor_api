const mongoose = require('mongoose');
const { Schema } = mongoose;

const gunTypes = ['light', 'medium', 'heavy', 'shell', 'explosive', 'eletric', 'shield']
const armorTypes = ['light', 'medium', 'heavy', 'super-heavy', 'titan', 'none', 'improvised']
const playerClass = ['sniper', 'assault', 'engeneer', 'medic', 'inteligence', 'hunter', 'vanguard']

// Armor Schema
const ArmorSchema = new Schema({
    type: { type: String, enum: armorTypes, required: true },
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    slots: { type: Number, required: true },
    desc: { type: String, required: false },
    url: { type: String, required: false }
});
const AttachmentSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: false },
    url: { type: String, required: false },
    mod: { type: Number, required: false },
    damage: { type: Number, required: false },
});
// Gun Schema
const GunSchema = new Schema({
    url: { type: String, required: false },
    name: { type: String, required: true },
    desc: { type: String, required: false },

    capacity: { type: Number, required: true },
    magazineSelected: { type: Number, required: true },
    damage: { type: Number, required: false },
    type: { type: String, enum: gunTypes, required: true },
    attachment: { type: [AttachmentSchema], required: false },
});
const GunsSchema = new Schema({
    primary: GunSchema,
    secondary: { type: GunSchema, required: false },
});
const MagazineSlotSchema = new Schema({
    bullets: { type: Number, required: true },
    type: { type: String, enum: gunTypes, required: true },
    capacity: { type: Number, required: true },
    _id: { type: String, required: false },
    desc: { type: String, required: false },
});
const MagazinesSchema = new Schema({
    primary: { type: [MagazineSlotSchema], required: true },
    secondary: { type: [MagazineSlotSchema], required: false },
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

// Companion Schema
const CompanionSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: false },
    maxHp: { type: Number, required: true },
    hp: { type: Number, required: true },
    usable: { type: Boolean, required: true },
    url: { type: String, required: false },
});

// Player Schema
const PlayerSchema = new Schema({
    userRegistry: { type: String, required: true },
    registry: { type: String, required: true },

    name: { type: String, required: true },
    codename: { type: String, required: true },
    photo: { type: String, required: false },
    status: { type: String, required: true },
    class: { type: String, enum: playerClass, required: true },

    gunSelected: { type: String, enum: ['primary', 'secondary'] },
    guns: { type: GunsSchema, required: true },
    magazines: { type: MagazinesSchema, required: true },
    companion: { type: CompanionSchema, required: false },
    nationality: { type: String, required: false },
    round: { type: Number, required: false },

    maxHp: { type: Number, required: true },
    hp: { type: Number, required: true },
    armor: { type: ArmorSchema, required: true },

    utilitaries: { type: [ItemSchema], required: true },
    items: { type: [ItemSchema], required: true },
});

const EnemieSchema = new Schema({
    obs: { type: String, required: false },
    name: { type: String, required: true },

    maxHp: { type: Number, required: true },
    hp: { type: Number, required: true },
    armor: { type: ArmorSchema, required: true },
    magazines: { type: [MagazineSlotSchema], required: true },
    gun: { type: GunSchema, required: true },
    items: { type: [ItemSchema], required: true },
    type: { type: String, required: false }
});

module.exports = {
    Player: mongoose.model('Player', PlayerSchema),
    Enemie: mongoose.model('Enemie', EnemieSchema),
};
