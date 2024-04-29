"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  ShieldCheck,
  ShieldOff,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";
import { Button } from "../../../../../components/ui/button";
import { member } from "@/types";

interface MemberItemProps {
  member: member;
  admin: boolean;
  handlePromoteUser: (userId: string) => void;
  handleDemoteUser: (userId: string) => void;
  handleKickUser: (userId: string) => void;
}
const MemberItem: React.FC<MemberItemProps> = ({
  member,
  admin,
  handlePromoteUser,
  handleDemoteUser,
  handleKickUser,
}) => {
  return (
    <div className="flex gap-4 items-center hover:bg-accent rounded-md h-full justify-between">
      <Link
        href={`/users/${member.id}`}
        className="flex gap-4 items-center cursor-pointer h-full px-4 py-2"
      >
        <Avatar className="cursor-pointer h-14 w-14">
          <AvatarImage
            src={member.image ? member.image : "/default_user.jpg"}
          />
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold truncate w-full">{member.name}</p>
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
              <DropdownMenuItem onClick={() => handleDemoteUser(member.id)}>
                <ShieldOff className="w-5 h-5 mr-2" />
                Descartar admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handlePromoteUser(member.id)}>
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
  );
};

export default MemberItem;
