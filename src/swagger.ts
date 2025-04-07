import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SISGESC API Documentation',
      version: '1.0.0',
      description: 'API documentation for the SISGESC system',
      contact: {
        name: 'API Support',
        url: 'https://github.com/dejardim/sisgesc-api'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routers/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 