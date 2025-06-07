const appUrl = process.env.WEB_APP_URL || "http://localhost:3000";

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

export const passwordRecoveryEmail = (codigo: string, expiraEm: Date) => {
  const expiraEmFormatado = expiraEm.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const recoveryLink = `${appUrl}/recuperarSenha/${codigo}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - Fit Fermendes</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    
    .container {
      max-width: 550px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      border: 1px solid #eaeef5;
    }
    
    h2 {
      color: #1a237e;
      text-align: center;
      margin-bottom: 25px;
      font-size: 26px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    p {
      margin-bottom: 18px;
      font-size: 16px;
    }
    
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(to right, #1a73e8, #0d47a1);
      color: #ffffff !important; /* Força texto branco */
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 17px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 10px rgba(26, 115, 232, 0.25);
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(26, 115, 232, 0.35);
    }
    
    .warning {
      background-color: #fff8e1;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ffc107;
      margin: 25px 0;
    }
    
    strong {
      color: #d32f2f;
    }
    
    .footer {
      font-size: 13px;
      color: #78909c;
      text-align: center;
      margin-top: 35px;
      padding-top: 20px;
      border-top: 1px solid #eceff1;
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 25px;
        margin: 15px;
      }
      
      h2 {
        font-size: 22px;
      }
      
      .button {
        padding: 12px 25px;
        font-size: 16px;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Recuperação de Senha</h2>
    <p>Olá,</p>
    <p>Recebemos uma solicitação para redefinir a senha da sua conta Fit Fermendes. Para continuar, clique no botão abaixo:</p>
    
    <div class="button-container">
      <a class="button" href="${recoveryLink}">Redefinir Senha</a>
    </div>
    
    <div class="warning">
      <p>Esse link expira em <strong>${expiraEmFormatado}</strong>. Se você não solicitou essa alteração, por favor ignore este e-mail.</p>
    </div>
    
    <div class="footer">
      © 2025 Fit Fermendes. Todos os direitos reservados.<br>
      Este é um e-mail automático, por favor não responda.
    </div>
  </div>
</body>
</html>`;
};
