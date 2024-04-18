"use client";

import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { LoginSchema } from "../schemas";
import { login } from "../actions/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "El correu ja està associat a un compte, prova d'iniciar sessió sense Google"
      : "";
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
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
              <Button
                size="sm"
                variant="link"
                asChild
                className="px-0 font-normal"
                type="button"
              >
                <Link href="/reset-password">Has oblidat la contrassenya?</Link>
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Inicia Sessió amb correu electrònic
        </Button>
      </form>
    </Form>
  );
};
