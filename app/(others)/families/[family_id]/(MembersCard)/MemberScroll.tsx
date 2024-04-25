"use client";

import {
  demoteUser,
  getFamilyMembers,
  kickUser,
  promoteUser,
} from "@/actions/families";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Role } from "@prisma/client";
import {
  EllipsisVerticalIcon,
  ShieldCheck,
  ShieldOff,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";
import { Button } from "../../../../../components/ui/button";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { member } from "@/types";

interface MemberScrollProps {
  familyId: string;
}

const MemberScroll: React.FC<MemberScrollProps> = ({ familyId }) => {
  const [members, setMembers] = useState<member[]>([]);
  const [admin, setAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  const getMembers = async () => {
    const response = await getFamilyMembers(familyId);
    if (response.error || !response.data) {
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      setMembers(response.data.members);
      setAdmin(response.data.admin);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const handlePromoteUser = async (userId: string) => {
    const response = await promoteUser(userId, familyId);
    if (response.error) {
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      getMembers();
      toast({
        title: "Usuari promocionat",
        description: response.success,
        variant: "success",
      });
    }
  };

  const handleDemoteUser = async (userId: string) => {
    const response = await demoteUser(userId, familyId);
    if (response.error) {
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      getMembers();
      toast({
        title: "Usuari descartat",
        description: response.success,
        variant: "success",
      });
    }
  };

  const handleKickUser = async (userId: string) => {
    const response = await kickUser(userId, familyId);
    if (response.error) {
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      getMembers();
      toast({
        title: "Usuari expulsat",
        description: response.success,
        variant: "success",
      });
    }
  };

  return (
    <ScrollArea className="max-h-[24rem]">
      {members &&
        members.map((member, i) => (
          <div
            key={i}
            className="flex gap-4 items-center hover:bg-accent rounded-md h-full justify-between"
          >
            <Link
              href={`/users/${member.id}`}
              className="flex gap-4 items-center cursor-pointer flex-grow h-full px-4 py-2"
            >
              <Avatar className="cursor-pointer h-14 w-14">
                <AvatarImage
                  src={member.image ? member.image : "/default_user.jpg"}
                />
              </Avatar>
              <div className="flex flex-col">
                <p className="font-semibold">{member.name}</p>
              </div>
            </Link>
            {admin && !member.myself && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-slate-200 mr-1"
                  >
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {member.role === "ADMIN" ? (
                    <DropdownMenuItem
                      onClick={() => handleDemoteUser(member.id)}
                    >
                      <ShieldOff className="w-5 h-5 mr-2" />
                      Descartar admin
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => handlePromoteUser(member.id)}
                    >
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Fer admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleKickUser(member.id)}>
                    <UserMinus className="w-5 h-5 mr-2" />
                    Expulsar de la familia
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
    </ScrollArea>
  );
};

export default MemberScroll;