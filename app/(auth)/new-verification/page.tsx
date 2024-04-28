import { Suspense } from "react";
import NewVerificationClient from "./NewVerificationClient";

const page = () => {
  return (
    <Suspense>
      <NewVerificationClient />
    </Suspense>
  );
};

export default page;
