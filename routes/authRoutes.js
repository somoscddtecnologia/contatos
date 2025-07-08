const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const router = express.Router()
const montaRetorno = require('../middlewares/montaRetorno')

/**
 * @swagger
 * /auth/login:
 *  post:
 *      sumary: Logar na aplicação
 *      tags: [Login]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/UsuarioLogin"
 *      responses:
 *          200:
 *              description: Logado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          404:
 *              description: Login não encontrado
 *                      
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body

    const dado = await Usuario.findOne({ email })

    if (!dado) {
        return res.status(401).json('Email inválido')
    }

    //const senhaCriptografada = await bcrypt.hash(senha, 10)

    if (!senha) {
        return res.status(401).json('Senha não enviada')
    }

    const senhaValida = await bcrypt.compare(senha, dado.senha)
    if (!senhaValida) {
        return res.status(401).json('Senha inválida')
    }

    const token = jwt.sign(
        { id: dado._id, email: dado.email },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        })

    const [status, retorno] = montaRetorno({ jwt: token }, "Login efetuado com sucesso.")
    res.status(status).json(retorno)

})

router.post('/register', async (req, res) => {
    //receber email e senha
    const { email, senha } = req.body

    //verificar se email não existe no banco
    const usuarioExiste = await Usuario.findOne({ email })
    if (usuarioExiste) {
        return res.status(400).json('Email já cadastrado')
    }

    //criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    console.log(senhaCriptografada)

    //salvar dados no banco
    const novoUsuario = new Usuario({ email, senha: senhaCriptografada })
    await novoUsuario.save()

    //apresentar resultado
    res.status(201).json('Usuário cadastrado com sucesso')
})

module.exports = router