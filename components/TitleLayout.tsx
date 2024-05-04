const TitleLayout = ({
  children,
  title,
}: Readonly<{
  children: React.ReactNode;
  title: string;
}>) => {
  return (
    <div className="container">
      <div className="flex justify-start items-center gap-6">
        <h1 className="text-4xl font-bold my-10 mr-10">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TitleLayout;
