"use client";
import {
  getRecipeToEdit,
  saveDraftRecipe,
  saveRecipe,
} from "@/actions/recipes";
import { RecipeImageDropZone } from "@/app/(others)/receptes/[recipe_id]/edita/RecipeImageDropzone";
import { FormError } from "@/components/formMessages/FormError";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { RecipeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, PencilRuler, Plus, Save, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import EditPageSkeleton from "./EditPageSkeleton";

type FormData = z.infer<typeof RecipeSchema>;

export default function EditRecipePage({
  params,
}: {
  params: { recipe_id: string };
}) {
  // Get url params
  const searchParams = useSearchParams();
  const newRecipe = searchParams.get("nou");

  // States for loading, error and success messages
  const [isLoading, setIsLoading] = useState(!newRecipe);
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // States for showing or hiding recommendations and origin
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);

  // Transition to disable inputs while submitting
  const [isPending, startTransition] = useTransition();

  // Router to redirect after saving the recipe
  const router = useRouter();

  // Image URL state
  const [image, setImage] = useState<string | null>(null);

  // Form handling
  const form = useForm<FormData>({
    resolver: zodResolver(RecipeSchema),
    defaultValues: {
      ingredients: [{ value: "" }],
      steps: [{ value: "" }],
      visibility: "PUBLIC",
    },
  });

  // Form watch to get the title
  const title = form.watch("title");

  // Field arrays for ingredients and steps
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

  // On submit function to save the recipe
  const onSubmit = async (values: z.infer<typeof RecipeSchema>) => {
    startTransition(() => {
      // Reset the error message
      setError("");

      // Save the recipe
      saveRecipe(values, params.recipe_id).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });

        // Redirect to the recipe page
        router.push(`/receptes/${params.recipe_id}`);
      });
    });
  };

  // On submit function to save the recipe as draft
  const handleDraftSave = async () => {
    startTransition(() => {
      setError("");
      const values = form.getValues();
      saveDraftRecipe(values, params.recipe_id).then((response) => {
        if ("error" in response) {
          setError(response.error);
          return;
        }
        toast({
          variant: "success",
          description: response.success,
        });
      });
    });
  };

  const getRecipe = useCallback(async () => {
    // If it's a new recipe, return
    if (newRecipe) return;

    // Get the recipe data
    const recipeData = await getRecipeToEdit(params.recipe_id);
    if ("error" in recipeData) {
      setError(recipeData.error);
      return;
    }

    // Set the recipe data to the form
    const {
      title,
      ingredients,
      steps,
      visibility,
      recommendations,
      origin,
      prep_time,
      total_time,
    } = recipeData;
    form.setValue("title", title!);
    form.setValue("prep_time", prep_time!);
    form.setValue("total_time", total_time!);
    if (recommendations) {
      setShowRecommendations(true);
      form.setValue("recommendations", recommendations);
    }
    if (origin) {
      setShowOrigin(true);
      form.setValue("origin", origin);
    }
    form.setValue("visibility", visibility as "PUBLIC" | "FAMILY" | "PRIVATE");
    setImage(recipeData.image);
    if (ingredients.length > 0) {
      ingredients.forEach((ingredient) => {
        appendIngredient({ value: ingredient });
      });
    }
    if (steps.length > 0) {
      steps.forEach((step) => {
        appendStep({ value: step });
      });
    }

    // Stop the loading state
    setIsLoading(false);
  }, [appendIngredient, appendStep, newRecipe, params.recipe_id, form]);

  // Get the recipe data to edit
  useEffect(() => {
    getRecipe();
  }, [getRecipe]);

  // Loading skeleton
  if (isLoading) {
    return <EditPageSkeleton />;
  }

  return (
    <div className="container max-w-[750px]">
      <h1 className="text-4xl font-bold my-10">
        {title ? title : <>Nova Recepta</>}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Imatge de la recepta */}
          <RecipeImageDropZone recipeId={params.recipe_id} image={image} />
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
                        onClick={() => {
                          setShowRecommendations(false);
                          form.setValue("recommendations", "");
                        }}
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
                onClick={() => {
                  setShowOrigin(true);
                  form.setValue("origin", "");
                }}
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
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibilitat de la recepta</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Visibilitat?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="PUBLIC">Publica</SelectItem>
                        <SelectItem value="FAMILY">Només Familiars</SelectItem>
                        <SelectItem value="PRIVATE">Privada</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormError message={error} />
          {/* Botons de guardar */}
          <div className="flex flex-col gap-4 items-start md:flex-row">
            <Button disabled={isPending} type="submit" className="gap-2">
              <Save size={20} />
              Guardar la Recepta
            </Button>
            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              onClick={() => handleDraftSave()}
              className="gap-2"
            >
              <PencilRuler size={20} />
              Guardar com a esborrany
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
