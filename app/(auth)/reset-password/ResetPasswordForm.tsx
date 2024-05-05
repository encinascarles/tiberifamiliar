"use client";

import { resetPassword } from "@/actions/authentication/resetPassword";
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
import { PasswordResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const ResetPasswordForm = () => {
  // Get the email from the URL
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email");

  // States for displaying error and success messages
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Router for navigation
  const router = useRouter();

  // Transition for the loading state
  const [isPending, startTransition] = useTransition();

  // Form hook
  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: initialEmail!,
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof PasswordResetSchema>) => {
    // Reset the error and success messages
    setError("");

    // Reset the password
    startTransition(() => {
      resetPassword(values).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
        router.back();
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
        <FormError message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          Envia correu de restabliment de contrasenya
        </Button>
      </form>
    </Form>
  );
};
