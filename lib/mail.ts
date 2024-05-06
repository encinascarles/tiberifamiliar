import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "verificacio@tiberifamiliar.com",
    to: email,
    subject: "Contirma el teu correu per Tiberi Familiar",
    html: `<p>Per favor, confirma el teu correu electrònic fent clic al següent enllaç: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "restabliment@tiberifamiliar.com",
    to: email,
    subject: "Solicitud de restabliment de contrasenya",
    html: `<p>Per favor, restableix la teva contrasenya fent clic al següent enllaç: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });
};

export const sendWelcomeEmail = async (email: string) => {
  await resend.emails.send({
    from: "welcome@tiberifamiliar.com",
    to: email,
    subject: "Benvingut a Tiberi Familiar",
    html: `<p>Benvingut a Tiberi Familiar, esperem que gaudeixis de la nostra aplicació.</p>`,
  });
};

export const sendInviteEmail = async (
  email: string,
  inviter: string,
  familyName: string
) => {
  await resend.emails.send({
    from: "invitacions@tiberifamiliar.com",
    to: email,
    subject: `El ${inviter} et convida a unir-te a la família ${familyName}`,
    html: `<p>El ${inviter} t'ha convidat a unir-te a la família ${familyName}, entra a <a href="https://www.tiberifamiliar.com">TiberiFamiliar</a> per acceptar la invitació!</p>`,
  });
};
