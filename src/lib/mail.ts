import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/nova-verificacio?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Contirma el teu correu per Tiberi Familiar",
    html: `<p>Per favor, confirma el teu correu electrònic fent clic al següent enllaç: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });
};
