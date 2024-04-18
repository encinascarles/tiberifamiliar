interface TextDividerProps {
  children: React.ReactNode;
}

export const TextDivider = ({ children }: TextDividerProps) => {
  if (!children) return null;

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase my-4">
        <span className="bg-background px-2 text-muted-foreground">
          o continua amb
        </span>
      </div>
    </div>
  );
};
