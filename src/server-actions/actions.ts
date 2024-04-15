"use server";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Inputs } from "@/app/(auth)/login/page";
// ...

export async function authenticate(formData: Inputs) {
  try {
    await signIn("credentials", formData, { callbackUrl: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
