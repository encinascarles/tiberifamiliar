import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="flex w-full md:w-fit">
      <Input
        type="text"
        placeholder="Cerca receptes"
        className="w-full md:w-[200px] h-9 rounded-r-none"
      />
      <Button className="w-[35px] p-0 h-9 rounded-l-none">
        <Search size={20} />
      </Button>
    </div>
  );
};

export default SearchBox;
