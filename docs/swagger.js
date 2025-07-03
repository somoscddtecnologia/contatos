const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition:{
        openai: '3.0.0',
        info: {
            title: 'API de Contatos',
            version: '1',
            description: 'Documentação de API utilizando Swagger'
        },
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec