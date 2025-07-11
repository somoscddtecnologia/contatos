const express = require("express")
const router = express.Router()

const Contatos = require('../models/Contato');

const montaRetorno = require("../utils/montaRetorno")

const { default: mongoose } = require("mongoose");

const basicAuth = require('../middlewares/basicAuth')
const apiKeyAuth = require('../middlewares/apiKeyAuth')
const bearerToken = require('../middlewares/bearerToken')

const viaCep = require('../middlewares/viaCep')

// Listar contatos
/**
 * @swagger
 * /:
 *  get:
 *      summary: Listar todos os contados da api
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
    let dados
    if (req.query.nome) {
        dados = await Contatos.find({ nome: req.query.nome });
    } else {
        dados = await Contatos.find();
    }

    const [status, retorno] = montaRetorno(dados, "Dados listados com sucesso.")

    res.status(status).json(retorno)
})

//Buscar por ID
/**
 * @swagger
 * /{id}:
 *  get:
 *      summary: Buscar um contato por ID
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
        const [status, retorno] = montaRetorno(null, err.message)
        res.status(status).json(retorno)
    }
})

// Criar contato
/**
 * @swagger
 * /:
 *  post:
 *      summary: Salvar Contato
 *      tags: [Contatos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ContatoSalvar"
 *      responses:
 *          200:
 *              description: Contato Salvo com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string          
 */
router.post('/', viaCep, async (req, res) => {
    const dados = await Contatos.create(req.body);
    res.status(200).json(dados)
})

//Atualizar por ID
/**
 * @swagger
 * /{id}:
 *  put:
 *      summary: Atualizar scontato por ID
 *      tags: [Contatos]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID do contato
 *          schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ContatoSalvar"
 *      responses:
 *          200:
 *              description: Contato atualizado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Contato'  
 *          404:
 *              description: Contato não encontrado
 */
router.put('/:id', viaCep, async (req, res) => {
    try {

        if (req.cep) {
            const { numero, complemento } = req.body

            if (numero === undefined) {
                return res.status(404).json({ error: 'Número não enviado' })
            }

            if (complemento === undefined) {
                return res.status(404).json({ error: 'Complemento não enviado' })
            }
        }



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


module.exports = router