import SignInForm from "@/components/admin/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | Sking Cosmetics - Admin Dashboard",
  description: "This is Signin Page Sking Cosmetics Admin Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
