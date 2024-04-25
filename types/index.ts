import { Role } from "@prisma/client";

export interface member {
  id: string;
  role: Role;
  image: string | null;
  name: string;
  myself: boolean;
  familyId: string;
}

export interface familycard {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  members: number;
}

export interface invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  familyName: string;
  familyImage: string | null;
}
