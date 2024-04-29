"use client";
import { createFamily } from "@/actions/families";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "../../../../components/formMessages/FormError";
import { FormSuccess } from "../../../../components/formMessages/FormSuccess";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { FamilySchema } from "../../../../schemas";

type FormData = z.infer<typeof FamilySchema>;

export default function NewFamilyPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FamilySchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createFamily(values).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
        router.push(`/families/${response.id}`);
      });
    });
  };

  return (
    <div className="container max-w-[750px]">
      <h1 className="text-4xl font-bold my-10">Nova Familia</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nom de la familia */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la familia</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Descripció */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripció</FormLabel>
                <FormControl>
                  <Textarea disabled={isPending} autoResize={true} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          {/* Botó de guardar */}
          <Button disabled={isPending} type="submit">
            Crear familia
          </Button>
        </form>
      </Form>
    </div>
  );
}
