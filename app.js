require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')

const swaggerSpec = require('./docs/swagger')

const contatoRoutes = require("./routes/contatoRoutes")
const authRoutes = require("./routes/authRoutes")


const app = express()
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Conectado"))
    .catch((err) => console.log("MongoDB não conectado:", err.message))

app.use('/', contatoRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})