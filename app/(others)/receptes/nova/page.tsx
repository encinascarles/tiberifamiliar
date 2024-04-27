"use client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { createRecipe } from "@/actions/recipes";
import { FormError } from "@/components/formMessages/FormError";
import { FormSuccess } from "@/components/formMessages/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RecipeSchema } from "@/schemas";
import { getSignedURL } from "@/actions/imageUpload";
import Image from "next/image";

type FormData = z.infer<typeof RecipeSchema>;

export default function NewRecipePage() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      title: "",
      ingredients: [],
      steps: [],
      recommendations: "",
      origin: "",
      image: "",
      visibility: "PUBLIC",
      image_file: undefined,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const onSubmit = async (values: z.infer<typeof RecipeSchema>) => {
    setError("");
    setSuccess("");
    const valuesToSend = { ...values };
    delete valuesToSend.image_file;
    if (values.image_file) {
      const checksum = await computeSHA256(values.image_file);
      const signedURL = await getSignedURL(
        values.image_file.type,
        values.image_file.size,
        checksum
      );
      if ("error" in signedURL) {
        setError(signedURL.error);
        return;
      }
      valuesToSend.image = signedURL.url.split("?")[0];
      console.log(signedURL);
      await fetch(signedURL.url, {
        method: "PUT",
        body: values.image_file,
        headers: {
          "Content-Type": values.image_file.type,
        },
      });
      // Clona los valores para no modificar el objeto original
    }

    startTransition(() => {
      // Elimina la propiedad image_file
      createRecipe(valuesToSend).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
        router.push(`/receptes/${response.id}`);
      });
    });
  };

  const generatePreview = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Nova Receta</h1>
      {previewUrl && (
        <Image src={previewUrl} alt="Preview" width={200} height={200} />
      )}
      <FormField
        control={form.control}
        name="image_file"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la recepta</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                disabled={isPending}
                onChange={(e) => {
                  if (e.target.files) {
                    form.setValue("image_file", e.target.files[0]);
                    generatePreview(e.target.files[0]);
                  }
                }}
              />
            </FormControl>
            <FormError message={form.formState.errors.image_file?.message} />
          </FormItem>
        )}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nom de la recepta */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la recepta</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Temps de preparació i total */}
          <div className="flex justify-between w-full gap-8">
            <FormField
              control={form.control}
              name="prep_time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Temps de Preparació</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("prep_time", parseInt(e.target.value));
                        }}
                      />
                      <span className="absolute inset-y-0 left-12 text-gray-400 flex items-center text-base md:text-sm pointer-events-none">
                        minuts
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Temps Total</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("total_time", parseInt(e.target.value));
                        }}
                      />
                      <span className="absolute inset-y-0 left-12 text-gray-400 flex items-center text-base md:text-sm pointer-events-none">
                        minuts
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* Ingredients */}
          <div>
            <FormLabel
              className={form.formState.errors.ingredients && "text-red-500"}
            >
              Ingredients
            </FormLabel>
            {ingredientFields.map((field, index) => (
              <FormItem key={field.id} className="mt-2">
                <FormControl>
                  <div className="flex">
                    <Input
                      disabled={isPending}
                      {...form.register(`ingredients.${index}.value`)}
                    />
                    <Button
                      disabled={isPending}
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2"
                    >
                      <Trash />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            ))}
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="mt-2 w-full"
              onClick={() => appendIngredient({ value: "" })}
            >
              <Plus />
            </Button>
          </div>
          {/* Preparació */}
          <div>
            <FormLabel
              className={form.formState.errors.steps && "text-red-500"}
            >
              Preparació
            </FormLabel>
            {stepFields.map((field, index) => (
              <FormItem key={field.id} className="mt-2">
                <FormControl>
                  <div className="flex items-center">
                    <span className="mr-3 text-orange-600 font-extrabold text-3xl w-10 text-center">
                      {index + 1}
                    </span>
                    <Textarea
                      disabled={isPending}
                      autoResize={true}
                      {...form.register(`steps.${index}.value`)}
                    />
                    <Button
                      disabled={isPending}
                      type="button"
                      onClick={() => removeStep(index)}
                      className="ml-2"
                    >
                      <Trash />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            ))}
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="mt-2 w-full"
              onClick={() => appendStep({ value: "" })}
            >
              <Plus />
            </Button>
          </div>
          {/* Recomanacions*/}
          <div>
            <FormLabel>
              Recomanacions <span className="text-orange-400">(Opcional)</span>
            </FormLabel>
            {!showRecommendations ? (
              <Button
                disabled={isPending}
                variant="outline"
                type="button"
                className="mt-2 w-full"
                onClick={() => setShowRecommendations(true)}
              >
                <Plus />
              </Button>
            ) : (
              <div>
                <FormItem className="mt-2">
                  <FormControl>
                    <div className="flex items-center">
                      <Textarea
                        disabled={isPending}
                        autoResize={true}
                        {...form.register("recommendations")}
                      />
                      <Button
                        disabled={isPending}
                        type="button"
                        onClick={() => setShowRecommendations(false)}
                        className="ml-2"
                      >
                        <Minus />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              </div>
            )}
          </div>
          {/* Origen de la recepta */}
          <div>
            <FormLabel>
              Origen de la recepta
              <span className="text-orange-400"> (Opcional)</span>
            </FormLabel>
            {!showOrigin ? (
              <Button
                disabled={isPending}
                variant="outline"
                type="button"
                className="mt-2 w-full"
                onClick={() => setShowOrigin(true)}
              >
                <Plus />
              </Button>
            ) : (
              <div>
                <FormItem className="mt-2">
                  <FormControl>
                    <div className="flex items-center">
                      <Textarea
                        disabled={isPending}
                        autoResize={true}
                        {...form.register("origin")}
                      />
                      <Button
                        disabled={isPending}
                        type="button"
                        onClick={() => setShowOrigin(false)}
                        className="ml-2"
                      >
                        <Minus />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              </div>
            )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          {/* Botó de guardar */}
          <Button disabled={isPending} type="submit">
            Guardar la Recepta
          </Button>
        </form>
      </Form>
    </div>
  );
}
