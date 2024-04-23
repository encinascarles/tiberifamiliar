import { Input } from "@/components/ui/input";

const SearchBox = () => {
  return (
    <Input
      type="text"
      placeholder="Cerca receptes"
      className="lg:w-60 headerbp:w-44 h-9"
    />
  );
};

export default SearchBox;
