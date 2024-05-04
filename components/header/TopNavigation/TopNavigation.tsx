"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  BrainCircuit,
  Earth,
  Heart,
  PencilRuler,
  Plus,
  User,
  Users,
} from "lucide-react";
import TopMenuItem from "./TopMenuItem";

const TopNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Receptes
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col">
              <TopMenuItem href="/receptes/personals">
                <User size={20} />
                Receptes personals
              </TopMenuItem>
              <TopMenuItem href="/receptes/esborranys">
                <PencilRuler size={20} />
                Esborranys
              </TopMenuItem>
              <TopMenuItem href="/receptes/preferides">
                <Heart size={20} />
                Receptes preferides
              </TopMenuItem>
              <TopMenuItem href="/receptes/familiars">
                <Users size={20} />
                Receptes familiars
              </TopMenuItem>
              <TopMenuItem href="/receptes/publiques">
                <Earth size={20} />
                Receptes publiques
              </TopMenuItem>
              <TopMenuItem href="/receptes/tiberia">
                <BrainCircuit size={20} />
                Receptes tiberIA
              </TopMenuItem>
              <TopMenuItem href="/receptes/nova">
                <Plus size={20} />
                Crear recepta
              </TopMenuItem>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Families
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="flex flex-col">
              <TopMenuItem href="/families">
                <Users className="w-5 h-5" />
                Les meves families
              </TopMenuItem>
              <TopMenuItem href="/families/nova">
                <Plus className="w-5 h-5" />
                Crear familia
              </TopMenuItem>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopNavigation;
