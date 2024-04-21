"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Earth, Heart, Plus, User, Users } from "lucide-react";
import Link from "next/link";
import MobileDrawerMenu from "./MobileDrawerMenu";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

const LoggedInHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 headerbp:px-8 container flex h-14 max-w-screen-2xl items-center">
      <div className="mr-4 hidden headerbp:flex">
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2 font-bold text-orange-600 tracking-wide"
        >
          <span>Tiberi Familiar</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Receptes</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col">
                  <MenuItem href="/receptes/personals">
                    <User className="w-5 h-5" />
                    Receptes personals
                  </MenuItem>
                  <MenuItem href="/receptes/preferides">
                    <Heart className="w-5 h-5" />
                    Receptes preferides
                  </MenuItem>
                  <MenuItem href="/receptes/familiars">
                    <Users className="w-5 h-5" />
                    Receptes familiars
                  </MenuItem>
                  <MenuItem href="/receptes/publiques">
                    <Earth className="w-5 h-5" />
                    Receptes publiques
                  </MenuItem>
                  <MenuItem href="/receptes/nova">
                    <Plus className="w-5 h-5" />
                    Crear recepta
                  </MenuItem>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Families</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex flex-col">
                  <MenuItem href="/families">
                    <Users className="w-5 h-5" />
                    Les meves families
                  </MenuItem>
                  <MenuItem href="/families/nova">
                    <Plus className="w-5 h-5" />
                    Crear familia
                  </MenuItem>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="headerbp:hidden pr-4 items-center flex">
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

const LoggedOutHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 headerbp:px-8 container flex h-14 max-w-screen-2xl items-center">
      <div className="mr-4 hidden headerbp:flex">
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2 font-bold text-orange-600 tracking-wide"
        >
          <span>Tiberi Familiar</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <Input
          type="text"
          placeholder="Cerca receptes"
          className="lg:w-60 headerbp:w-44 h-9"
        />
        <Link href="/login">
          <Button className="h-9">Inicia sessió</Button>
        </Link>
        <Link href="/register">
          <Button className="h-9">Registra&apos;t</Button>
        </Link>
      </div>
    </div>
  </header>
);

const MenuItem = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => (
  <Link href={href} legacyBehavior passHref>
    <NavigationMenuLink
      className={cn(
        navigationMenuTriggerStyle(),
        "gap-2 w-[220px] justify-start"
      )}
    >
      {children}
    </NavigationMenuLink>
  </Link>
);

const Header = () => {
  const user = useCurrentUser();
  return user ? <LoggedInHeader /> : <LoggedOutHeader />;
};

export { Header };
