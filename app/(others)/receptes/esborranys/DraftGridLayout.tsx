type rDraftGridLayoutProps = {
  children: React.ReactNode;
};

const DraftGridLayout: React.FC<rDraftGridLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">{children}</div>
  );
};

export default DraftGridLayout;
