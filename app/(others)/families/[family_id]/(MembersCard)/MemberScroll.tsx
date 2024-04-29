"use client";

import {
  demoteUser,
  getFamilyMembersResponse,
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
  getMembersResponse: getFamilyMembersResponse;
  admin: boolean;
}

const MemberScroll: React.FC<MemberScrollProps> = ({
  familyId,
  getMembersResponse,
  admin,
}) => {
  // State for members
  const [members, setMembers] = useState<member[]>([]);

  // Toast hook
  const { toast } = useToast();

  // Update members when getMembersResponse changes
  useEffect(() => {
    if ("error" in getMembersResponse) {
      toast({
        title: "Error",
        description: getMembersResponse.error,
        variant: "destructive",
      });
    } else {
      setMembers(getMembersResponse.members);
    }
  }, [getMembersResponse]);

  // Promote user handler
  const handlePromoteUser = async (userId: string) => {
    // Be optimistic
    const pastMembers = members;
    setMembers(
      members.map((member) => {
        if (member.id === userId) {
          member.role = "ADMIN";
        }
        return member;
      })
    );

    // Promote user
    const response = await promoteUser(userId, familyId);

    // If error, revert changes and show error toast
    if ("error" in response) {
      setMembers(pastMembers);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Usuari promocionat",
      description: response.success,
      variant: "success",
    });
  };

  // Demote user handler
  const handleDemoteUser = async (userId: string) => {
    // Be optimistic
    const pastMembers = members;
    setMembers(
      members.map((member) => {
        if (member.id === userId) {
          member.role = "MEMBER";
        }
        return member;
      })
    );

    // Demote user
    const response = await demoteUser(userId, familyId);

    // If error, revert changes and show error toast
    if ("error" in response) {
      setMembers(pastMembers);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Usuari descartat",
      description: response.success,
      variant: "success",
    });
  };

  // Kick user handler
  const handleKickUser = async (userId: string) => {
    // Be optimistic
    const pastMembers = members;
    setMembers(members.filter((member) => member.id !== userId));

    // Kick user
    const response = await kickUser(userId, familyId);

    // If error, revert changes and show error toast
    if ("error" in response) {
      setMembers(pastMembers);
      return toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }
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
