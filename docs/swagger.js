const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Contatos',
            version: '1',
            description: 'Documentação de API utilizando Swagger'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Localhost'
            },
            {
                url: 'http://homologacao:3000',
                description: 'Servidor Homologação'
            },
        ],
        components: {
            schemas: {
                Contato: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '60f1v59b614'
                        },
                        nome: {
                            type: 'string',
                            example: 'Carlos Henrique'
                        },
                        telefone:{
                            type: 'string',
                            example: '32988679783'
                        },
                        email: {
                            type: 'string',
                            example: 'chenrique@fiemg.com.br'
                        },
                    }
                },
                UsuarioLogin: {
                    type: 'object',
                    properties: {
                        login: {
                            type: 'string',
                            example: 'Carlos Henrique'
                        },
                        senha:{
                            type: 'string',
                            example: '32988679783'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec