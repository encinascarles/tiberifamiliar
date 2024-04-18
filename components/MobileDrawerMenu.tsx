import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Bell, LogOut, Menu, Plus, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function MobileDrawerMenu({
  Personal = false,
}: {
  Personal?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="pl-6 text-lg font-bold">
          <span>Tiberi Familiar</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 pr-6">
          <div className="min-w-full display: table">
            <div className="flex flex-col space-y-3">
              <Link href="/personal/receptes">Les meves receptes</Link>
              <Link href="/families/receptes">Receptes familiars</Link>
              <Link href="/receptes">Receptes publiques</Link>
            </div>
            <div className="flex flex-col space-y-3 mt-10">
              <h2 className="text-md font-semibold">Usuari</h2>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <Link href="/perfil">Perfil</Link>
              </div>
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Invitacions</span>
              </div>
              <Separator w-20 />
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <Link href="/families">Les meves Families</Link>
              </div>
              <div className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                <Link href="/families/new">Crear una Familia</Link>
              </div>
              <Separator />
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuració</span>
              </div>
              <Separator />
              <h3 className="text-md font-medium">Carles Encinas</h3>
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Tancar sessió</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
