"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authenticate } from "@/server-actions/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "El correu electrònic no és vàlid." }),
  password: z
    .string()
    .min(5, { message: "La contrassenya ha de tenir almenys 6 caràcters." }),
});

export type Inputs = z.infer<typeof formSchema>;

export default function LoginPage() {
  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    const result = await authenticate(data);

    if (!result) {
      console.log("Something went wrong");
      return;
    }

    if (result.error) {
      // set local error state
      console.log(result.error);
      return;
    }
    //form.reset();
  };

  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">Inicia sessió</h1>
      <p className="text-sm text-muted-foreground">
        Entra eles teves credencials per continuar
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processForm)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Correu Electrònic" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Contrassenya"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Inicia Sessió amb correu electrònic
          </Button>
        </form>
      </Form>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase my-4">
          <span className="bg-background px-2 text-muted-foreground">
            o continua amb
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full gap-2">
        <Image
          className="w-6 h-6"
          width="24"
          height="24"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        Google
      </Button>
    </div>
  );
}
