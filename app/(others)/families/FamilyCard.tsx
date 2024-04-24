import { Card, CardTitle } from "@/components/ui/card";
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
      <Card className="w-full md:w-[600px] flex h-[180px]">
        <Image
          src={image ? image : "/demo_images/family.png"}
          alt="family image"
          objectFit="cover"
          height={180}
          width={230}
          className="w-[230px] h-[180px] rounded-l-lg object-cover "
        />
        <div className="flex flex-col p-4 gap-2">
          <CardTitle className="text-lg">{name}</CardTitle>
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
