const mongoose = require('mongoose');

// Definindo um schema mais robusto para imagens
const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    props: { type: String, required: true }
});

// Definindo o schema principal
const operationSchema = new mongoose.Schema({
    draw: { type: [String], required: true }, // Array de Strings (se refere a desenhos ou similar)
    combat: { type: Boolean, required: true }, // Booleano para saber se é combate
    images: { type: [imageSchema], required: true }, // Array de objetos de imagem
    showCompleteMap: { type: Boolean, required: true }, // Booleano para mostrar mapa completo
    dbImages: { type: [imageSchema], required: true }, // Array de imagens no banco de dados (com nome e URL)
    completeMap: { type: String }, // String para o mapa completo (provavelmente URL ou referência)
    ruinedMap: { type: String }, // String para o mapa danificado (também pode ser URL ou referência)
    others: { type: [imageSchema] },

    megaCombat: { type: Boolean, required: false }
});

// Criando o modelo para o MongoDB
module.exports = mongoose.model('game', operationSchema);
