"use client";
import { inviteUser } from "@/actions/families";
import { FormError } from "@/components/formMessages/FormError";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
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
import { InviteUserSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof InviteUserSchema>;

export function InviteUserButton({ familyId }: { familyId: string }) {
  // Error and success messages states
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  // Toast hook
  const [isPending, startTransition] = useTransition();

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: "",
    },
  });

  // Submit handler to invite user
  const onSubmit = (values: z.infer<typeof InviteUserSchema>) => {
    setError("");
    startTransition(() => {
      inviteUser(values, familyId).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        form.reset();
        toast({
          title: "Usuari convidat",
          description: response.success,
          variant: "success",
        });
        closeDialog();
      });
    });
  };

  return (
    <>
      <Button className="mt-4 gap-2" onClick={openDialog}>
        <UserPlus size={20} /> Convida un nou membre
      </Button>
      <Dialog
        open={showDialog}
        onOpenChange={closeDialog}
        defaultOpen={showDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Nom de la familia */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Convida per correu electrònic</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
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
    </>
  );
}
