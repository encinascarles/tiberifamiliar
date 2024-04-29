"use client";

import {
  demoteUser,
  getFamilyMembers,
  kickUser,
  promoteUser,
} from "@/actions/families";
import { useToast } from "@/components/ui/use-toast";
import { member } from "@/types";
import { useEffect, useState } from "react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import MemberItem from "./MemberItem";

interface MemberScrollProps {
  familyId: string;
}

const MemberScroll: React.FC<MemberScrollProps> = ({ familyId }) => {
  const [members, setMembers] = useState<member[]>([]);
  const [admin, setAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  const getMembers = async () => {
    const response = await getFamilyMembers(familyId);
    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    setMembers(response.members);
    setAdmin(response.admin);
  };

  useEffect(() => {
    getMembers();
  }, []);

  const handlePromoteUser = async (userId: string) => {
    const response = await promoteUser(userId, familyId);
    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    getMembers();
    toast({
      title: "Usuari promocionat",
      description: response.success,
      variant: "success",
    });
  };

  const handleDemoteUser = async (userId: string) => {
    const response = await demoteUser(userId, familyId);
    if ("error" in response) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    getMembers();
    toast({
      title: "Usuari descartat",
      description: response.success,
      variant: "success",
    });
  };

  const handleKickUser = async (userId: string) => {
    const response = await kickUser(userId, familyId);
    if ("error" in response) {
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }
    getMembers();
    toast({
      title: "Usuari expulsat",
      description: response.success,
      variant: "success",
    });
  };

  return (
    <ScrollArea className="max-h-[24rem]">
      {members &&
        members.map((member, i) => (
          <MemberItem
            member={member}
            admin={admin}
            handlePromoteUser={handlePromoteUser}
            handleDemoteUser={handleDemoteUser}
            handleKickUser={handleKickUser}
          />
        ))}
    </ScrollArea>
  );
};

export default MemberScroll;
