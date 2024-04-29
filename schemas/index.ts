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
  visibility: z.enum(["PUBLIC", "PRIVATE", "FAMILY"]),
});

export const DraftRecipeSchema = z.object({
  title: z.string().optional(),
  prep_time: z.number().optional(),
  total_time: z.number().optional(),
  ingredients: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  steps: z
    .array(
      z.object({
        value: z.string(),
      })
    )
    .optional(),
  recommendations: z.string().optional(),
  origin: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FAMILY"]).optional(),
});

export const FamilySchema = z.object({
  name: z
    .string()
    .min(1, "El nom no pot estar buit")
    .max(20, "El nom és massa llarg"),
  description: z.string().min(1, "La descripció no pot estar buida"),
});

export const InviteUserSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
});
