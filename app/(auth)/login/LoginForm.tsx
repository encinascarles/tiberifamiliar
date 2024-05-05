"use client";

import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/actions/authentication/login";

export const LoginForm = () => {
  const router = useRouter();
  // Get the error from the URL if google oauth failed
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correu ja està associat a un compte, prova d'iniciar sessió directament"
      : "";
  const callbackUrl = searchParams.get("callbackUrl");

  // States for displaying error and success messages
  const [error, setError] = useState<string | undefined>(urlError);
  const [success, setSuccess] = useState<string | undefined>("");

  // Transition for the loading state
  const [isPending, startTransition] = useTransition();

  // Form hook
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // Reset the error and success messages
    setError("");
    setSuccess("");

    // Login with oauth
    startTransition(() => {
      login(values, callbackUrl).then((response) => {
        if (response) {
          if ("error" in response) {
            setError(response.error);
            return;
          }
          setSuccess(response.success);
        }
      });
    });
  };

  // Forgot password button click handler
  const handleForgotPassword = () => {
    // Add email to the URL to autofill the email field in the forgot password form
    const email = form.getValues("email");
    router.push(`/reset-password?email=${email && encodeURIComponent(email)}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  disabled={isPending}
                  {...field}
                  placeholder="Correu Electrònic"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full flex flex-col items-center">
              <FormControl>
                <Input
                  disabled={isPending}
                  {...field}
                  type="password"
                  placeholder="Contrassenya"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="sm"
          variant="link"
          className="px-0 font-normal"
          type="button"
          onClick={() => handleForgotPassword()}
        >
          Has oblidat la contrassenya?
        </Button>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Inicia Sessió amb correu electrònic
        </Button>
      </form>
    </Form>
  );
};
