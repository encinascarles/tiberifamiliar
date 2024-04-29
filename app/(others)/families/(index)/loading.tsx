import NewFamilyCard from "./NewFamilyCard";
import SkeletonFamilyCard from "./SkeletonFamilyCard";

const LoadingUserFamiliesPage = () => {
  return (
    <div className="px-6 w-full md:w-fit md:mx-auto">
      <h1 className="text-4xl font-bold my-10">Les teves families</h1>
      <div className="flex flex-col gap-4">
        <NewFamilyCard />
        <SkeletonFamilyCard />
        <SkeletonFamilyCard />
        <SkeletonFamilyCard />
        <SkeletonFamilyCard />
      </div>
    </div>
  );
};

export default LoadingUserFamiliesPage;
