"use client";

import { editprofile } from "@/actions/user/editProfile";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { EditProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditProfilePage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      originalPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof EditProfileSchema>) => {
    startTransition(() => {
      editprofile(values)
        .then((response) => {
          if ("error" in response) {
            setError(response.error);
            return;
          }
          update({
            name: values.name,
            email: values.email,
          });
          setError(undefined);
          setSuccess(response.success);
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="container max-w-[750px]">
      <h1 className="2xl:ml-0 text-4xl font-bold my-10 mr-10">
        Edita el teu perfil
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
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
                <FormLabel>Correu electrònic</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originalPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Anterior contrassenya</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nova contrassenya</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} type="password" />
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
                  <Input disabled={isPending} {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="py-4">
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Modifica el perfil
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfilePage;
