import { get } from "http";
import { auth } from "../auth";
import { getUserById } from "@/data/user";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentFullUser = async () => {
  const session = await auth();
  const user = await getUserById(session?.user?.id as string);
  return user;
};
