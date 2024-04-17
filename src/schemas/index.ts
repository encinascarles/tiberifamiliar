import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
  password: z
    .string()
    .min(1, { message: "És necessari proporcionar una contrassenya." }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "El correu electrònic no és vàlid." }),
    password: z
      .string()
      .min(5, { message: "La contrassenya ha de tenir 5 o més caràcters" }),
    name: z
      .string()
      .min(2, { message: "El nom ha de tenir 2 o més caràcters" }),
    username: z
      .string()
      .min(2, { message: "El nom d'usuari ha de tenir 2 o més caràcters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les dontrassenyes han de coincidir.",
    path: ["confirmPassword"], // this will point the error to 'confirmPassword' field
  });

export const PasswordResetSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, { message: "La contrassenya ha de tenir 5 o més caràcters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les dontrassenyes han de coincidir.",
    path: ["confirmPassword"], // this will point the error to 'confirmPassword' field
  });
