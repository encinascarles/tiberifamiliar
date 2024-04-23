import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MenuItemProps {
  children: React.ReactNode;
  href: string;
}

const TopMenuItem: React.FC<MenuItemProps> = ({ children, href }) => (
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

export default TopMenuItem;
