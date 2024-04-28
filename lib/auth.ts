import { auth } from "../auth";
import { db } from "./db";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const currentFullUser = async () => {
  const session = await auth();
  const user = await db.user.findUnique({
    where: { id: session?.user?.id },
  });
  return user;
};

export const safeGetSessionUser = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("show: Usuari no trobat!");
  return user;
};
