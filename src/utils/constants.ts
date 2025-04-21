export const twoFactorAuthEmail = (codigo: string, expiraEm: Date) => {
  const expiraEmFormatado = expiraEm.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Código de Verificação</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
          margin: 20px 0;
          color: #1a73e8;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Autenticação de Dois Fatores Fit Fermendes</h2>
        <p>Olá,</p>
        <p>Use o código abaixo para acessar sua conta com segurança:</p>
  
        <div class="code">${codigo}</div>
  
        <p>Este código expira em <strong>${expiraEmFormatado}</strong>. Se você não solicitou este código, ignore este e-mail.</p>
  
        <div class="footer">
          © 2025 Fit Fermendes. Todos os direitos reservados.
        </div>
      </div>
    </body>
  </html>`;
};
