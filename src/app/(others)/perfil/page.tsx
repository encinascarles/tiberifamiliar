import { auth } from "@/lib/auth";

export default async function PersonalProfilePage() {
  const session = await auth();
  console.log(session);
  return <h1>Perfil</h1>;
}
