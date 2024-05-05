"use client";

import { newPassword } from "@/actions/authentication/newPassword";
import { FormError } from "@/components/formMessages/FormError";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const NewPasswordForm = () => {
  // Get the token from the URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // State for displaying error messages
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Router for navigation
  const router = useRouter();

  // Transition for the loading state
  const [isPending, startTransition] = useTransition();

  // Form hook
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");

    startTransition(() => {
      if (!token) return setError("Falta el token!");
      newPassword(values, token).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          title: "Contrassenya canviada",
          description: response.success,
          variant: "success",
        });
        router.push("/");
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="password"
                  disabled={isPending}
                  {...field}
                  placeholder="Contrassenya"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="password"
                  disabled={isPending}
                  {...field}
                  placeholder="Repeteix la contrassenya"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Canviar contrassenya
        </Button>
      </form>
    </Form>
  );
};
