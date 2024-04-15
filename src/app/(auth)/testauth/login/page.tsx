// @ts-nocheck
"use client";
import { authenticate } from "@/server-actions/actions";
import { useFormState } from "react-dom";

export default function testLoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  return (
    <form action={dispatch}>
      <input type="text" placeholder="Email" name="email" />
      <input type="password" placeholder="Password" name="password" />
      <button type="submit">login</button>
    </form>
  );
}
