"use client";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SearchBox = () => {
  const router = useRouter();

  const handleSearch = (e: any) => {
    e.preventDefault();
    const search = e.target[0].value;
    if (search) {
      router.push(`/receptes/busca?search=${search}`);
    }
    e.target[0].value = "";
  };
  return (
    <form onSubmit={handleSearch}>
      <div className="flex w-full md:w-fit">
        <Input
          type="text"
          placeholder="Cerca receptes"
          className="w-full md:w-[200px] h-9 rounded-r-none"
        />
        <Button type="submit" className="w-[35px] p-0 h-9 rounded-l-none">
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
