import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const RecipeCard = () => (
  <Card className="cursor-pointer">
    <Image
      src="/demo_images/recipe_image.jpg"
      alt="Recipe Image"
      width="800"
      height="800"
      className="rounded-t-lg"
    />
    <CardHeader>
      <CardTitle>Patates amb tomàquet</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between">
        <Link href="perfil/_userid_n" className="hover:text-orange-500">
          @carlesencinas
        </Link>
        <p>30 min</p>
        <p>50 min</p>
      </div>
    </CardContent>
  </Card>
);

export default RecipeCard;
