import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

interface FamilyCardProps {
  id: string;
  name: string;
  description: string | null;
  members: number;
  image: string | null;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  id,
  name,
  description,
  members,
  image,
}) => {
  return (
    <Link href={`/families/${id}`}>
      <Card className="w-full md:w-[600px] flex h-[180px] ">
        <div className="relative h-full w-[150px] xs:w-[180px] sm:w-[230px] flex-shrink-0 transition-all duration-300">
          <Image
            src={image ? image : "/demo_images/family.png"}
            alt={`${name} family image`}
            sizes="(max-width: 500px) 150px, (max-width: 640px) 180px, 230px"
            quality={50}
            fill
            objectFit="cover"
            className="rounded-l-lg z-10"
          />
          <Skeleton className="h-full w-full rounded-r-none rounded-l-lg z-0" />
        </div>
        <div className="flex flex-col p-4 gap-2 overflow-hidden">
          <CardTitle className="text-lg truncate w-full">{name}</CardTitle>
          <p className="text-sm text-gray-500">
            <b>Membres:</b> {members}
          </p>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-4 overflow-hidden text-justify">
              <b>Descripció:</b> {description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default FamilyCard;
