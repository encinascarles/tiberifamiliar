"use client";
import { createFamily, editFamily, inviteUser } from "@/actions/families";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteUserSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Textarea } from "../../../../components/ui/textarea";

type FormData = z.infer<typeof InviteUserSchema>;

export function InviteUserButton({ familyId }: { familyId: string }) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email_username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof InviteUserSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      inviteUser(values, familyId).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 mx-4 gap-2">
          <UserPlus className="w-5 h-5" /> Convida un nou membre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Nom de la familia */}
            <FormField
              control={form.control}
              name="email_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'usuari o correu electrònic</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
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
                Convidar usuari
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
