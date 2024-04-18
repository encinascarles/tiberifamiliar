import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import Image from "next/image";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../components/ui/avatar";
import { Checkbox } from "../../../../components/ui/checkbox";

export default function ShowRecipePage() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Patates amb tomàquet</h1>
      <Card>
        <div className="flex flex-col md:flex-row justify-stretch ">
          <Image
            src="/demo_images/recipe_image.jpg"
            height="800"
            width="800"
            alt="recipe image"
            className="rounded-t-md md:rounded-none md:rounded-l-md  md:w-8/12 aspect-square"
          />
          <div className="flex flex-col p-6 gap-2 md:w-4/12">
            <h1 className="text-lg">
              <b>Temps de Preparació:</b> 40min
            </h1>
            <h1 className="text-lg">
              <b>Temps de Total:</b> 60min
            </h1>

            <h1 className="text-lg md:hidden lg:block">
              <b>Recomanacions:</b> Mollit nulla non aute ullamco. Dolore
              consectetur minim qui ea. Aute ut labore aute velit officia.
              Deserunt ullamco nostrud Lorem aliquip quis mollit nisi deserunt.
              Veniam proident ipsum labore labore elit aliquip cupidatat.
            </h1>
            <h1 className="text-lg md:hidden lg:block">
              <b>Procedència:</b> Mollit nulla non aute ullamco. Dolore
              consectetur minim qui ea. Aute ut labore aute velit officia.
              Deserunt ullamco nostrud Lorem aliquip quis mollit nisi deserunt.
              Veniam proident ipsum labore labore elit aliquip cupidatat.
            </h1>

            <div className="flex gap-4 items-center w-full justify-center border-t-2 pt-4">
              <Avatar className="cursor-pointer h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <h1 className="font-bold">Feta per Carles Encinas Turró</h1>
            </div>
          </div>
        </div>
        <h1 className="text-xl hidden md:block lg:hidden">
          <b>Recomanacions:</b> Mollit nulla non aute ullamco. Dolore
          consectetur minim qui ea. Aute ut labore aute velit officia. Deserunt
          ullamco nostrud Lorem aliquip quis mollit nisi deserunt. Veniam
          proident ipsum labore labore elit aliquip cupidatat.
        </h1>
        <h1 className="text-xl hidden md:block lg:hidden">
          <b>Procedència:</b> Mollit nulla non aute ullamco. Dolore consectetur
          minim qui ea. Aute ut labore aute velit officia. Deserunt ullamco
          nostrud Lorem aliquip quis mollit nisi deserunt. Veniam proident ipsum
          labore labore elit aliquip cupidatat.
        </h1>
      </Card>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2 text-lg my-3">
                <Checkbox className="w-6 h-6" />
                400g Farina
              </li>
            ))}
          </ul>
        </CardContent>
        <CardHeader>
          <CardTitle>Preparació</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-outside pl-6 marker:text-orange-600 marker:font-extrabold marker:text-2xl ml-4 ">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="text-lg my-3">
                Minim proident do voluptate enim. Proident non id reprehenderit
                nostrud labore consequat nisi fugiat. Ipsum nulla veniam duis
                nulla aute adipisicing fugiat. Deserunt ea nulla nostrud nisi do
                nostrud excepteur consectetur voluptate. Excepteur dolore nulla
                dolore deserunt sunt ex aute velit pariatur non Lorem.
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
