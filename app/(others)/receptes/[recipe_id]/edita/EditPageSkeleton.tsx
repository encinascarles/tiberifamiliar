import { Skeleton } from "@/components/ui/skeleton";

const EditPageSkeleton = () => {
  return (
    <div className="container max-w-[750px]">
      <Skeleton className="h-[40px] w-full my-10" />
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageSkeleton;
