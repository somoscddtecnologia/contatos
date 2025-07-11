const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const router = express.Router()
const montaRetorno = require('../utils/montaRetorno')

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
        const [status, retorno] = montaRetorno(null, 'Email inválido')
        return res.status(status).json(retorno)
    }

    //const senhaCriptografada = await bcrypt.hash(senha, 10)

    if (!senha) {
        const [status, retorno] = montaRetorno(null, 'Senha não enviada')
        return res.status(status).json(retorno)
    }

    const senhaValida = await bcrypt.compare(senha, dado.senha)
    if (!senhaValida) {
        const [status, retorno] = montaRetorno(null, 'Senha inválida')
        return res.status(status).json(retorno)
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
        const [status, retorno] = montaRetorno(null, 'Email já cadastrado')
        return res.status(status).json(retorno)
    }

    //criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10)

    //console.log(senhaCriptografada)

    //salvar dados no banco
    const novoUsuario = new Usuario({ email, senha: senhaCriptografada })
    await novoUsuario.save()

    //apresentar resultado
    const [status, retorno] = montaRetorno(novoUsuario, 'Usuário cadastrado com sucesso')
    return res.status(status).json(retorno)
})

module.exports = router