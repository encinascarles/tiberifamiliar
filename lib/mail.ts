import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

  await resend.emails.send({
    from: "verificacio@keepoapp.com",
    to: email,
    subject: "Contirma el teu correu per Tiberi Familiar",
    html: `<p>Per favor, confirma el teu correu electrònic fent clic al següent enllaç: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "restabliment@keepoapp.com",
    to: email,
    subject: "Solicitud de restabliment de contrasenya",
    html: `<p>Per favor, restableix la teva contrasenya fent clic al següent enllaç: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });
};