// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PROYECTO79 API',
      version: '1.0.0',
      description: 'Documentación de endpoints de autenticación, catálogo de retos y evaluación'
    },
    servers: [
      {
        url: 'https://proyecto79-1.onrender.com',
        description: 'Servidor de Producción (Render)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo Local'
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
    }
  },
  apis: ['./src/router/*.ts', './index.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};