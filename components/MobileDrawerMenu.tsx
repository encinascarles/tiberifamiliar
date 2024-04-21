import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Bell,
  Earth,
  Heart,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "next-auth/react";

export default function MobileDrawerMenu() {
  const user = useCurrentUser();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-[85%]">
        <Link
          href="/"
          className="pl-6 text-2xl font-bold text-orange-600 tracking-wide"
        >
          <span>Tiberi Familiar</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100%-2rem)] mb-10 pl-6 pr-6">
          <div className="flex flex-col gap-6 min-w-full text-lg">
            <div className="flex flex-col">
              <h2 className="text-md font-semibold">Receptes</h2>
              <MenuItem href="/receptes/personals">
                <User className="mr-2 h-4 w-4" />
                Receptes personals
              </MenuItem>
              <MenuItem href="/receptes/preferides">
                <Heart className="mr-2 h-4 w-4" />
                Receptes preferides
              </MenuItem>
              <MenuItem href="/receptes/familiars">
                <Users className="mr-2 h-4 w-4" />
                Receptes familiars
              </MenuItem>
              <MenuItem href="/receptes/publiques">
                <Earth className="mr-2 h-4 w-4" />
                Receptes publiques
              </MenuItem>
              <MenuItem href="/receptes/nova">
                <Plus className="mr-2 h-4 w-4" />
                Crear recepta
              </MenuItem>
            </div>
            <div className="flex flex-col min-w-full">
              <h2 className="text-md font-semibold">Families</h2>
              <MenuItem href="/families">
                <Users className="mr-2 h-4 w-4" />
                Les meves families
              </MenuItem>
              <MenuItem href="/families/nova">
                <Plus className="mr-2 h-4 w-4" />
                Crear familia
              </MenuItem>
            </div>
            <div className="flex flex-col">
              <h2 className="text-md font-semibold">{user?.name}</h2>
              <MenuItem href="/perfil">
                <User className="mr-2 h-4 w-4" />
                <Link href="/perfil">Perfil</Link>
              </MenuItem>
              <MenuItem href="/perfil/invitacions">
                <Bell className="mr-2 h-4 w-4" />
                <span>Invitacions</span>
              </MenuItem>
              <MenuItem href="/perfil/configuracio">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuració</span>
              </MenuItem>
              <SheetClose asChild>
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  <div className="flex items-center h-12 hover:bg-accent rounded-md">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Tancar sessió</span>
                  </div>
                </button>
              </SheetClose>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

const MenuItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <SheetClose asChild>
    <Link href={href}>
      <div className="flex items-center h-12 hover:bg-accent rounded-md">
        {children}
      </div>
    </Link>
  </SheetClose>
);
