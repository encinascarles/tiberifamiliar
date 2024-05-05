"use client";
import { editFamily } from "@/actions/families/editFamily";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FamilySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FamilyImageDropZone from "../nova/FamilyImageDropzone";

type FormData = z.infer<typeof FamilySchema>;

export function EditFamilyButton({
  familyId,
  name,
  description,
  image,
}: {
  familyId: string;
  name: string;
  description: string;
  image: string | null;
}) {
  // States for error and success messages
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  // Image URL state
  const [imageUrl, setImageUrl] = useState<string | null>(image);

  // Transition to disable inputs while submitting
  const [isPending, startTransition] = useTransition();

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: name,
      description: description,
    },
  });

  // Submit handler to edit family
  const onSubmit = (values: z.infer<typeof FamilySchema>) => {
    // Reset messages
    setError("");

    // Edit family
    startTransition(() => {
      // Add the image URL to the values
      values.image = imageUrl!!;
      editFamily(values, familyId).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          title: "Familia editada",
          description: response.success,
          variant: "success",
        });
        closeDialog();
      });
    });
  };

  return (
    <>
      <Button className="gap-2" onClick={openDialog}>
        <Pencil size={20} />
        Edita la familia
      </Button>
      <Dialog
        open={showDialog}
        onOpenChange={closeDialog}
        defaultOpen={showDialog}
      >
        <DialogContent className="sm:max-w-[425px] pt-10">
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
              {/* Imatge de la familia */}
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">Imatge</p>
                <FamilyImageDropZone
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                />
              </div>
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

              {/* Botó de guardar */}
              <DialogFooter>
                <Button disabled={isPending} type="submit">
                  Editar familia
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
