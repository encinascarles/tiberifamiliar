"use client";
import { editFamily } from "@/actions/families";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
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
import { useToast } from "@/components/ui/use-toast";
import { FamilySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../../../../components/ui/textarea";

type FormData = z.infer<typeof FamilySchema>;

export function EditFamilyButton({
  familyId,
  name,
  description,
}: {
  familyId: string;
  name: string;
  description: string;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: name,
      description: description,
    },
  });

  const onSubmit = (values: z.infer<typeof FamilySchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      editFamily(values, familyId).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        setSuccess(response.success);
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Pencil size={20} />
          Edita la familia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                    <Textarea
                      disabled={isPending}
                      autoResize={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            {/* Botó de guardar */}
            <DialogFooter>
              <Button disabled={isPending} type="submit">
                Crear familia
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
