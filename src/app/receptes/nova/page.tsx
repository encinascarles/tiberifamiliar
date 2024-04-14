"use client";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash, Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  preparationTime: z.number().min(1, {
    message: "El tiempo de preparación tiene que ser mayor a 0.",
  }),
  totalTime: z
    .number()
    .min(1, { message: "El tiempo total tiene que ser mayor a 0." }),
  ingredients: z
    .array(z.string())
    .nonempty({ message: "Debe agregar al menos un ingrediente." }),
  steps: z
    .array(z.string())
    .nonempty({ message: "Debe agregar al menos un paso de preparación." }),
  origin: z.string().optional(),
  recommendations: z.string().optional(),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewRecipePage() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      preparationTime: "",
      totalTime: "",
      ingredients: [],
      steps: [],
      origin: "",
      recommendations: "",
      image: "",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Nova Receta</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Nom de la receta */}
          <FormField
            control={form.control}
            name="name"
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
              name="preparationTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Temps de Preparació</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue(
                            "preparationTime",
                            parseInt(e.target.value)
                          );
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
              name="totalTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Temps Total</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("totalTime", parseInt(e.target.value));
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
                    <Input {...form.register(`ingredients.${index}`)} />
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
              onClick={() => appendIngredient("")}
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
                      {...form.register(`steps.${index}`)}
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
              onClick={() => appendStep("")}
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
          {/* Botó de guardar */}
          <Button type="submit">Guardar la Recepta</Button>
        </form>
      </Form>
    </div>
  );
}
