import app from "./app";
import { swaggerDocs } from "./swagger/swaggerConfig";

// Porta da aplicação
const URL: string = process.env.APP_URL || "http://localhost";
const port: number = parseInt(process.env.PORT || "3000", 10) || 3000;

// Inicializando o servidor
app.listen(port, () => {
  // Documentação do swagger
  console.log(`App escutando a porta ${port}`)
  swaggerDocs(app, URL, port);
});
