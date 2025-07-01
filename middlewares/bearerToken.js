const jwt = require('jsonwebtoken')

function bearerToken(req, res, next) {
    const auth = req.headers['authorization']

    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json('Autenticação requerida')
    }

    const token = auth.split(" ")[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        next()
    }
    catch (err) {
        res.status(401).json('Token inválido')
    }

}

module.exports = bearerToken