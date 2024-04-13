import Link from "next/link";
import { Input } from "@/components/ui/input";
import { UserDropdownMenu } from "@/components/UserDropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import MobileDrawerMenu from "./MobileDrawerMenu";
const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 headerbp:px-8 container flex h-14 max-w-screen-2xl items-center">
      <div className="mr-4 hidden headerbp:flex">
        <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
          <span>Tiberi Familiar</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/personal/receptes"
          >
            Les meves receptes
          </Link>
          <Link
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/families/receptes"
          >
            Receptes familiars
          </Link>
          <Link
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            href="/receptes"
          >
            Receptes publiques
          </Link>
        </nav>
      </div>
      <div className="headerbp:hidden pr-4">
        <MobileDrawerMenu />
      </div>
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <Input
          type="text"
          placeholder="Cerca receptes"
          className="headerbp:w-60 h-9"
        />
        <div className="hidden headerbp:block">
          <UserDropdownMenu />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
