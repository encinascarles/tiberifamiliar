"use server";

import { getUserFamilies } from "@/actions/families";
import FamilyCard from "./FamilyCard";

const UserFamiliesPage = async () => {
  const responseFamilies = await getUserFamilies();
  if (responseFamilies.error || !responseFamilies.data) return;
  const families = responseFamilies.data;

  return (
    <div className="container">
      <h1 className="text-4xl font-bold my-10">Les teves families</h1>
      <div className="flex flex-col gap-4">
        {families.map((family) => (
          <FamilyCard
            key={family.id} // Add key prop
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
