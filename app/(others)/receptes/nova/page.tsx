"use client";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { RecipeSchema } from "../../../../schemas";
import { createRecipe } from "../../../../actions/recipes";
import { FormError } from "../../../../components/FormError";
import { FormSuccess } from "../../../../components/FormSuccess";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof RecipeSchema>;

export default function NewRecipePage() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
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

  const onSubmit = (values: z.infer<typeof RecipeSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createRecipe(values).then((data) => {
        setError(data?.error);
        if (data?.success) {
          toast({
            variant: "success",
            description: "Recepta creada correctament!",
          });
          router.push(`/receptes/${data.id}`);
        }
      });
    });
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Nova Receta</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nom de la receta */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la receta</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                    <Input {...form.register(`ingredients.${index}.value`)} />
                    <Button
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
                      autoResize={true}
                      {...form.register(`steps.${index}.value`)}
                    />
                    <Button
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
                        autoResize={true}
                        {...form.register("recommendations")}
                      />
                      <Button
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
                        autoResize={true}
                        {...form.register("origin")}
                      />
                      <Button
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
          <Button type="submit">Guardar la Recepta</Button>
        </form>
      </Form>
    </div>
  );
}
