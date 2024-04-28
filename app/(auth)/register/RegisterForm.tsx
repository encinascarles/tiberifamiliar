"use client";

import { register } from "@/actions/authentication";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const RegisterForm = () => {
  // State for displaying error messages
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Transition for the loading state
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  // Form hook
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        setSuccess(response.success);
      });
    });
  };

  // Handle enter key on the initial email input
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openDialog();
    }
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                {...field}
                placeholder="Correu Electrònic"
                onKeyDown={handleKeyDown}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        className="w-full mt-2"
        type="button"
        onClick={() => setShowDialog(true)}
      >
        Registra&apos;t amb correu electrònic
      </Button>
      <Dialog
        open={showDialog}
        onOpenChange={closeDialog}
        defaultOpen={showDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registre amb correu electrònic</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nom i Cognoms</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Correu Electrònic</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contrassenya</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="password" {...field} />
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
                    <FormLabel>Repeteix la contrassenya</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="my-4">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button type="submit" className="w-full">
              Registra&apos;t
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};
