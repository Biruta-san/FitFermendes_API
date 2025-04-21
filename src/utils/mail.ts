import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  textAsHtml: boolean = true
) => {
  // Configure o transporter (aqui usando Gmail como exemplo)
  const service: string | undefined = process.env.EMAIL_SERVICE_SENDER;
  const mail: string | undefined = process.env.EMAIL_ADRRESS_SENDER;
  const password: string | undefined = process.env.EMAIL_PASSWORD_SENDER;

  const transporter = nodemailer.createTransport({
    service: service,
    auth: {
      user: mail,
      pass: password,
    },
  });

  // Defina os dados do e-mail
  const mailOptions = {
    from: `"Fit Fermendes" <${mail}>`,
    to,
    subject,
    text: textAsHtml ? undefined : text,
    html: textAsHtml ? text : undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado: " + info.response);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
};
