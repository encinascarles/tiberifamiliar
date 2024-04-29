import { Skeleton } from "@/components/ui/skeleton";

const MemberItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <Skeleton className="rounded-full h-14 w-14 flex-shrink-0" />
      <Skeleton className=" h-5 flex-grow max-w-[200px]" />
    </div>
  );
};

export default MemberItemSkeleton;
