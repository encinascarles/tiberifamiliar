"use client";
import { Button } from "@/components/ui/button";
import { SizeableInput } from "@/components/ui/personalized/SizeableInput";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const BigSearchBox = () => {
  const router = useRouter();
  const search = useSearchParams();
  const searchQuery = search.get("search");
  const [text, setText] = useState(searchQuery || "");
  const [debouncedText] = useDebounce(text, 300);

  const handleSearch = useCallback(
    (inputText: string) => {
      if (inputText) {
        router.push("/receptes/cerca?search=" + inputText);
      }
    },
    [router]
  );

  useEffect(() => {
    if (debouncedText) {
      handleSearch(debouncedText);
    }
  }, [debouncedText, handleSearch]);

  return (
    <div className="relative flex max-w-[800px] mx-auto">
      <SizeableInput
        type="text"
        placeholder="Cerca receptes"
        className="w-full pr-[65px] h-16 text-2xl pl-6"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        type="submit"
        className="absolute right-0 top-0 w-[65px] p-0 h-16 rounded-l-none"
        onSubmit={() => handleSearch(text)}
      >
        <Search size={40} />
      </Button>
    </div>
  );
};

export default BigSearchBox;
