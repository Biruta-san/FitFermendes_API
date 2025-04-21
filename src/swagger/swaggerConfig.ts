import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fit Fermendes API",
      version: "1.0.0",
      description: "Documentação de API do Fit Fermendes",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no formato: Bearer <token>",
        },
      },
    },
    tags: [
      { name: "Usuário", description: "Endpoints relacionados a usuários" },
      {
        name: "Modalidade",
        description: "Endpoints relacionados a modalidade",
      },
      { name: "Aluno", description: "Endpoints relacionados a aluno" },
      { name: "Status Aula", description: "Endpoints relacionados a status de aula" },
      { name: "Aula", description: "Endpoints relacionados a aula" },
    ],
  },
  apis: ["./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, url: string, port: number) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger disponível em ${url}:${port}/api-docs`);
}
