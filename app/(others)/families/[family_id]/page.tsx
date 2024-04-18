import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../components/ui/avatar";

export default function FamilyPage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10 mr-10">Familia Encinas</h1>
      <div className="flex justify-between gap-4">
        <Card className="w-8/12">
          <div className="aspect-square relative">
            <Image
              src="/demo_images/family.png"
              fill
              alt="family image"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <CardFooter className="pt-4">
            <p>
              Amet pariatur consequat magna eu tempor incididunt velit irure
              veniam elit anim fugiat in nostrud. Lorem officia commodo proident
              cillum eu. Veniam incididunt aliquip nostrud minim nisi mollit
              commodo quis. Cillum velit nisi tempor ullamco est cupidatat
              laborum magna culpa velit.
            </p>
          </CardFooter>
        </Card>
        <Card className="w-4/12 h-full">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold p-4">Membres:</h1>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 hover:bg-orange-200 px-4 py-2 rounded-md cursor-pointer"
              >
                <Avatar className="cursor-pointer h-14 w-14">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
                <div className="flex flex-col">
                  <p> CarlesEncinas</p>
                  <p> @carlesencinas</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <p>Nombre: Familia Encinas</p>
            <p>Integrantes: 4</p>
            <p>Edad promedio: 30</p>
          </CardDescription>
        </CardContent>
        <CardFooter>
          <button className="btn">Editar</button>
        </CardFooter>
      </Card>
    </div>
  );
}
