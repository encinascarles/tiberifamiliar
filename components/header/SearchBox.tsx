"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SearchBox = () => {
  const router = useRouter();
  const pathname = usePathname();

  // If in Search page, not show the search box in the header
  if (pathname === "/receptes/cerca") {
    return <div className="w-full" />;
  }
  const handleSearch = (e: any) => {
    e.preventDefault();
    const search = e.target[0].value;
    if (search) {
      router.push("/receptes/cerca?search=" + search);
    }
    e.target[0].value = "";
  };
  return (
    <form onSubmit={handleSearch} className="w-full md:w-fit">
      <div className="relative flex w-full md:w-fit">
        <Input
          type="text"
          placeholder="Cerca receptes"
          className="w-full md:w-[240px] pr-[40px] h-9"
        />
        <Button
          type="submit"
          className="absolute right-0 top-0 w-[35px] p-0 h-9 rounded-l-none"
        >
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
