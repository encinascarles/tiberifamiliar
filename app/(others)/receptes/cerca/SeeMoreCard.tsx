import { Card } from "@/components/ui/card";
import { ArrowBigDown } from "lucide-react";
import Link from "next/link";

const SeeMoreCard = ({ name }: { name: string }) => (
  <Link href="/receptes/nova" className="md:col-span-2 xl:col-span-3">
    <Card className="px-6 flex flex-col gap-8 items-center justify-center text-4xl cursor-pointer font-extrabold text-white bg-orange-400 min-h-60 h-full">
      <h1>{name}</h1>
      <ArrowBigDown className="text-white" size={100} />
    </Card>
  </Link>
);

export default SeeMoreCard;
