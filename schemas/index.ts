import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
  password: z
    .string()
    .min(1, { message: "És necessari proporcionar una contrassenya." }),
});

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email({ message: "El correu electrònic no és vàlid." })
      .transform((email) => email.toLowerCase()),
    password: z
      .string()
      .min(5, { message: "La contrassenya ha de tenir 5 o més caràcters" }),
    name: z
      .string()
      .min(2, { message: "El nom ha de tenir 2 o més caràcters" }),
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

//Image properties
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

export const RecipeSchema = z.object({
  title: z.string().min(1, "El títol no pot estar buit"),
  prep_time: z.number().refine((value) => value > 0, {
    message: "Temps no vàlid",
  }),
  total_time: z.number().refine((value) => value > 0, {
    message: "Temps no vàlid",
  }),
  ingredients: z
    .array(
      z.object({
        value: z.string().min(1, "No pot haver-hi un ingredient buit"),
      })
    )
    .nonempty({ message: "Ha d'haver-hi com a mínim un ingredient" }),
  steps: z
    .array(
      z.object({
        value: z.string().min(1, "No pot haver-hi un pas buit"),
      })
    )
    .nonempty({ message: "Debe agregar al menos un paso de preparación." }),
  recommendations: z.string().optional(),
  origin: z.string().optional(),
  image: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FAMILY"]),
  image_file: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "La imatge ha d'ocupar menys de 3MB")
    .refine((file) => {
      return file.type.startsWith("image/");
    }, "L'arxiu ha de ser una imatge")
    .optional(),
});

export const FamilySchema = z.object({
  name: z.string().min(1, "El nom no pot estar buit"),
  description: z.string().min(1, "La descripció no pot estar buida"),
});

export const InviteUserSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
});
