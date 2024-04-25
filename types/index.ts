import { Role } from "@prisma/client";

export interface member {
  id: string;
  role: Role;
  image: string | null;
  name: string;
  myself: boolean;
  familyId: string;
}
