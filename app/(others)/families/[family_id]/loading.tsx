import { Skeleton } from "@/components/ui/skeleton";

const ShowFamilyPage = () => {
  return (
    <div className="px-4 sm:px-8 container">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4 items-start">
          <div className="w-full lg:w-8/12">
            <div className="flex flex-col">
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="h-4 w-1/2 my-4" />
            </div>
          </div>
          <Skeleton className="h-80 w-full lg:w-4/12" />
        </div>
        <Skeleton className="h-64 w-full " />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default ShowFamilyPage;
