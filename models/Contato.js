const mongoose = require('mongoose');

const ContatoSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        telefone: { type: String, required: true },
        cep: { type: String, required: true },
        logradouro: { type: String, required: true },
        bairro: { type: String, required: true },
        localidade: { type: String, required: true },
        uf: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Contatos', ContatoSchema)