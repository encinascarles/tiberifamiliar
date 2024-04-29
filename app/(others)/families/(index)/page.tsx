"use server";

import { getUserFamilies } from "@/actions/families";
import FamilyCard from "./FamilyCard";
import NewFamilyCard from "./NewFamilyCard";

const UserFamiliesPage = async () => {
  const families = await getUserFamilies();
  if ("error" in families) throw new Error(families.error);

  return (
    <div className="px-6 w-full md:w-fit md:mx-auto">
      <h1 className="text-4xl font-bold my-10">Les teves families</h1>
      <div className="flex flex-col gap-4">
        <NewFamilyCard />
        {families.map((family) => (
          <FamilyCard
            key={family.id}
            id={family.id}
            name={family.name}
            description={family.description}
            members={family.members}
            image={family.image}
          />
        ))}
      </div>
    </div>
  );
};

export default UserFamiliesPage;
