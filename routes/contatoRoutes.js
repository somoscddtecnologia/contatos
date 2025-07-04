const express = require("express")
const router = express.Router()
const Contatos = require('../models/Contato');
const { default: mongoose } = require("mongoose");

const basicAuth = require('../middlewares/basicAuth')
const apiKeyAuth = require('../middlewares/apiKeyAuth')
const bearerToken = require('../middlewares/bearerToken')

// Listar contatos
/**
 * @swagger
 * /:
 *  get:
 *      sumary: Listar todos os contados da api
 *      tags: [Contatos]
 *      responses:
 *          200:
 *              description: Lista de contatos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Contato'
 *          404:
 *              description: Contato não encontrado
 *                      
 */
router.get('/', async (req, res) => {
    const dados = await Contatos.find();

    const [status, retorno] = montaRetorno(dados, "Dados listados com sucesso.")

    res.status(status).json(retorno)
})

//Buscar por ID
/**
 * @swagger
 * /{id}:
 *  get:
 *      sumary: Buscar um contato por ID
 *      tags: [Contatos]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do contato
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Contato encontrado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Contato'  
 *          404:
 *              description: Contato não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const [status, retorno] = montaRetorno(null, "Id enviado não é válido.")
            return res.status(status).json(retorno)
        }
        const dado = await Contatos.findById(req.params.id);
        if (!dado) {
            const [status, retorno] = montaRetorno(null, "erro, não achamos o id.")
            return res.status(status).json(retorno)
        }

        const [status, retorno] = montaRetorno(dado, "Contato consultado com sucesso.")
        res.status(status).json(retorno)
    }
    catch (err) {
        res.status(404).json({ "error": err.message })
    }
})

// Criar contato
router.post('/', async (req, res) => {
    const dados = await Contatos.create(req.body);
    res.status(200).json(dados)
})

//Atualizar por ID
router.put('/:id', async (req, res) => {
    try {
        const dado = await Contatos.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!dado) {
            return res.status(404).json({ error: 'Contato não encontrado' })
        }
        res.json(dado)
    }
    catch (err) {
        res.status(404).json({ "error": err.message })
    }
})

//deletar por ID
router.delete('/:id', async (req, res) => {
    try {
        const dado = await Contatos.findByIdAndDelete(req.params.id)
        if (!dado) {
            return res.status(404).json({ error: 'Contato não encontrado' })
        }
        res.json({ message: 'Contato deletado com sucesso!' })
    }
    catch (err) {
        res.status(404).json({ "error": err.message })
    }
})


function montaRetorno(dados, menssagem) {

    let alert
    let status = 200
    if (!dados) {
        alert = 'fail'
        status = 404
    } else {
        alert = dados.length == 0 ? 'warning' : 'success'
    }

    return [
        status,
        {
            "alert": alert,
            "message": menssagem,
            "data": dados
        }
    ];
}

module.exports = router