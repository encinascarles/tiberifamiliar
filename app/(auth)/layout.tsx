import { Card } from "../../components/ui/card";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen sm:container h-svh min-h-[600px] flex items-center justify-center">
      <Card className="margin-auto relative flex h-[80vh] min-h-[600px] w-full border-0 sm:border shadow-none sm:shadow-sm items-center">
        <div className="hidden lg:block h-full w-6/12">
          <div className="flex rounded-l-lg h-full bg-orange-600 p-14 text-white flex-col justify-between tracking-wide">
            <Link href="/">
              <h1 className="text-2xl font-bold">Tiberi Familiar</h1>
            </Link>
            <h2 className="text-xl">
              Receptari familiar per compartir amb els teus
            </h2>
          </div>
        </div>
        <div className="lg:relative h-full w-full lg:w-6/12 flex justify-center items-center p-8">
          <Link href="/">
            <h1 className="absolute lg:hidden top-12 left-12 text-2xl font-bold text-orange-600 tracking-wide">
              Tiberi Familiar
            </h1>
          </Link>
          {children}
        </div>
      </Card>
    </div>
  );
}
