"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import LoginButton from "./LoginButton";
import Logo from "./Logo";
import MobileDrawerMenu from "./MobileNavigation/MobileDrawerMenu";
import NewRecipeButton from "./NewRecipeButton";
import RegisterButton from "./RegisterButton";
import SearchBox from "./SearchBox";
import TopNavigation from "./TopNavigation/TopNavigation";
import { UserDropdownMenu } from "./UserDropdownMenu";

const LoggedInHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 headerbp:px-8 container flex h-14 max-w-screen-2xl items-center">
      <div className="mr-4 hidden headerbp:flex">
        <Logo />
        <TopNavigation />
      </div>
      <div className="headerbp:hidden pr-4 items-center flex">
        <MobileDrawerMenu />
      </div>
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <SearchBox />
        <NewRecipeButton />
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
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <SearchBox />
        <LoginButton />
        <RegisterButton />
      </div>
    </div>
  </header>
);

const Header = () => {
  const user = useCurrentUser();
  return user ? <LoggedInHeader /> : <LoggedOutHeader />;
};

export default Header;
