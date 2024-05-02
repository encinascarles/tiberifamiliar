import Link from "next/link";
import { Card } from "../../../../components/ui/card";
import { ExternalLink } from "lucide-react";

const SeeMoreCard = () => (
  <Link href="/receptes/nova">
    <Card className="flex flex-col gap-8 items-center justify-center text-4xl cursor-pointer font-extrabold text-white bg-neutral-200 hover:bg-orange-100 min-h-96 h-full">
      <ExternalLink size={60} />
      <h1>Veure més</h1>
    </Card>
  </Link>
);

export default SeeMoreCard;
