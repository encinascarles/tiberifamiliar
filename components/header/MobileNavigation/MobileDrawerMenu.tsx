import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Bell,
  BrainCircuit,
  Earth,
  Heart,
  LogOut,
  Menu,
  PencilRuler,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import MobileMenuItem from "./MobileMenuItem";
import NavSection from "./NavSection";

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
            <NavSection title="Receptes">
              <MobileMenuItem href="/receptes/personals">
                <User className="mr-2 h-4 w-4" />
                Receptes personals
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/esborranys">
                <PencilRuler className="mr-2 h-4 w-4" />
                Esborranys
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/preferides">
                <Heart className="mr-2 h-4 w-4" />
                Receptes preferides
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/familiars">
                <Users className="mr-2 h-4 w-4" />
                Receptes familiars
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/publiques">
                <Earth className="mr-2 h-4 w-4" />
                Receptes publiques
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/receptari">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Receptari IA
              </MobileMenuItem>
              <MobileMenuItem href="/receptes/nova">
                <Plus className="mr-2 h-4 w-4" />
                Crear recepta
              </MobileMenuItem>
            </NavSection>
            <NavSection title="Families">
              <MobileMenuItem href="/families">
                <Users className="mr-2 h-4 w-4" />
                Les meves families
              </MobileMenuItem>
              <MobileMenuItem href="/families/nova">
                <Plus className="mr-2 h-4 w-4" />
                Crear familia
              </MobileMenuItem>
            </NavSection>
            <NavSection title={user?.name as string}>
              <MobileMenuItem href="/perfil">
                <User className="mr-2 h-4 w-4" />
                <Link href="/perfil">Perfil</Link>
              </MobileMenuItem>
              <MobileMenuItem href="/perfil/invitacions">
                <Bell className="mr-2 h-4 w-4" />
                <span>Invitacions</span>
              </MobileMenuItem>
              <MobileMenuItem href="/perfil/configuracio">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuració</span>
              </MobileMenuItem>
              <SheetClose asChild>
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  <div className="flex items-center h-12 hover:bg-accent rounded-md">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Tancar sessió</span>
                  </div>
                </button>
              </SheetClose>
            </NavSection>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
