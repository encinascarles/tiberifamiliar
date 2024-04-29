"use client";
import { createFamily } from "@/actions/families";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FamilySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FamilyImageDropZone from "./FamilyImageDropzone";

type FormData = z.infer<typeof FamilySchema>;

export default function NewFamilyPage() {
  // States for error and success messages
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Transition to disable inputs while submitting
  const [isPending, startTransition] = useTransition();

  // Image URL state
  const [imageUrl, setImageUrl] = useState<string | undefined>("");

  // Router to redirect after creating the family
  const router = useRouter();

  // Form handling
  const form = useForm<FormData>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // On submit function to create the family
  const onSubmit = (values: z.infer<typeof FamilySchema>) => {
    setError("");
    startTransition(() => {
      // Add the image URL to the values
      values.image = imageUrl;
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
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Imatge</p>
            <FamilyImageDropZone
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />
          </div>
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
          {/* Botó de guardar */}
          <Button disabled={isPending} type="submit">
            Crear familia
          </Button>
        </form>
      </Form>
    </div>
  );
}
