import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MemberScroll from "./MemberScroll";
import { InviteUserButton } from "../InviteUserButton";

interface UserScrollProps {
  familyId: string;
  admin: boolean;
}

const MembersCard: React.FC<UserScrollProps> = ({ familyId, admin }) => {
  return (
    <Card className="w-full lg:w-4/12">
      <CardHeader>
        <CardTitle>Membres</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <MemberScroll familyId={familyId} />
          {admin && <InviteUserButton familyId={familyId} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembersCard;
