import { NewPasswordForm } from "../../../components/NewPasswordForm";

const NewPasswordPage = () => {
  return (
    <div className=" flex flex-col items-center gap-2 w-full mx-auto sm:w-[350px]">
      <h1 className="text-2xl font-semibold tracking-tight">
        Reseteja la contrassenya
      </h1>
      <p className="text-sm text-muted-foreground">
        Entra La nova contrassenya
      </p>
      <NewPasswordForm />
    </div>
  );
};

export default NewPasswordPage;
