import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Header from "@/components/header/Header";
import { SessionProvider } from "next-auth/react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <Header />
            <main>{children}</main>
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </>
  );
}
