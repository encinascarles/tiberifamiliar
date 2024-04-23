interface NavSectionProps {
  children: React.ReactNode;
  title?: string;
}

const NavSection: React.FC<NavSectionProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-md font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default NavSection;
