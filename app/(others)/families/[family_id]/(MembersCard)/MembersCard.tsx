"use server";
import { getFamilyMembers } from "@/actions/families";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteUserButton } from "../InviteUserButton";
import MemberScroll from "./MemberScroll";

interface UserScrollProps {
  familyId: string;
  admin: boolean;
}

const MembersCard: React.FC<UserScrollProps> = async ({ familyId, admin }) => {
  // Get family members, pass error to parent
  const membersResponse = await getFamilyMembers(familyId);

  return (
    <Card className="w-full lg:w-4/12">
      <CardHeader>
        <CardTitle>Membres</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <MemberScroll
            familyId={familyId}
            MembersResponse={membersResponse}
            admin={admin}
          />
          {admin && <InviteUserButton familyId={familyId} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersCard;
