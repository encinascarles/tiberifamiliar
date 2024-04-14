"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "El correu electrònic no és vàlid." }),
    username: z
      .string()
      .min(2, { message: "El nom d'usuari ha de tenir almenys 2 caràcters." }),
    password: z
      .string()
      .min(6, { message: "La contrassenya ha de tenir almenys 6 caràcters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir.",
    path: ["confirmPassword"], // this will point the error to 'confirmPassword' field
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
        <h1 className="text-2xl font-semibold tracking-tight">
          Crea un compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Entra el teu correu electrònic per continuar
        </p>
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

        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" type="button">
              Registra&apos;t amb correu electrònic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registre amb correu electrònic</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nom i Cognoms</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Correu Electrònic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nom d&apos;usuari</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contrassenya</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repeteix contrassenya</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Registra
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
    </Form>
  );
}
