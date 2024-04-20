import { Plus } from "lucide-react";
import Link from "next/link";
import MobileDrawerMenu from "./MobileDrawerMenu";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 headerbp:px-8 container flex h-14 max-w-screen-2xl items-center">
      <div className="mr-4 hidden headerbp:flex">
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2 font-bold text-orange-600 tracking-wide"
        >
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
          className="lg:w-60 headerbp:w-44 h-9"
        />
        <Link href="/receptes/nova">
          <Button className="rounded-full w-9 h-9 p-0">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
        <div className="hidden headerbp:block">
          <UserDropdownMenu />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
