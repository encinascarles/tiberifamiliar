import Footer from "@/components/Footer";
import Header from "@/components/header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div>
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
