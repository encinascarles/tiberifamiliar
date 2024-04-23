import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";

interface MobileMenuItemProps {
  href: string;
  children: React.ReactNode;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ href, children }) => (
  <SheetClose asChild>
    <Link href={href}>
      <div className="flex items-center h-12 hover:bg-accent rounded-md">
        {children}
      </div>
    </Link>
  </SheetClose>
);

export default MobileMenuItem;
